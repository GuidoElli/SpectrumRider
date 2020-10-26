import librosa
import numpy as np
from scipy.signal import butter, lfilter, filtfilt
from scipy.interpolate import griddata
import soundfile as sf
from pydub import AudioSegment
import tempfile
import os
from tqdm import tqdm

# Filters
def butter_bandpass(lowcut, highcut, fs, order=5):
	nyq = 0.5 * fs
	low = lowcut / nyq
	high = highcut / nyq
	b, a = butter(order, [low, high], btype='band')
	return b, a
def butter_bandpass_filter(data, lowcut, highcut, fs, order=5):
	b, a = butter_bandpass(lowcut, highcut, fs, order=order)
	y = lfilter(b, a, data)
	return y


# Initialization
mp3 = AudioSegment.from_mp3('ppp.mp3')
_, path = tempfile.mkstemp()
mp3.export(path, format="wav")
del mp3
audio, fs = sf.read(path)
if audio.ndim == 2:
	audio = audio[60*fs:fs*60+fs, 0]

# Parameters
n_bands = 8
bands_borders = np.array([20, 400, 1000, 2000, 4000, 6000, 9000, 12000, 20000])
upsample_freq = 5
win_length_time = 0.1
upsample_time = 5

# program
win_length_samples = int(win_length_time * fs)
n_frames = int(len(audio) / win_length_samples) - 1
z_init_matrix = np.zeros((n_frames, n_bands))
z_matrix = np.zeros((n_frames * upsample_time, (n_bands-1) * upsample_freq + 1))
audio_length_time = len(audio)/fs
for f in tqdm(range(n_frames)):
	frame = audio[(f * win_length_samples): np.min([f * win_length_samples + win_length_samples, len(audio)])]
	for b in range(n_bands):
		lowcut = bands_borders[b]
		highcut = bands_borders[b + 1]
		filtered_frame = butter_bandpass_filter(frame, lowcut, highcut, fs, 3)
		rms = np.sqrt(sum(np.power(filtered_frame, 2)))
		z_init_matrix[f, b] = rms
for b in range(n_bands):
	z_init_matrix[:, b] = np.cbrt(z_init_matrix[:, b] / z_init_matrix[:, b].max())

# interpolate
grid_x, grid_y = np.mgrid[0:1.0000001:1/((n_frames-1)*upsample_time), 0:1.0000001:1/((n_bands-1)*upsample_freq)]
data_values = z_init_matrix.reshape(-1, 1)
range_x = np.arange(0, 1.0000001, 1/(n_frames-1))
range_y = np.arange(0, 1.0000001, 1/(n_bands-1))
data_points = np.zeros((len(data_values), 2))
for i in range(len(range_x)):
	for j in range(len(range_y)):
		data_points[i*len(range_y)+j, 0] = range_x[i]
		data_points[i*len(range_y)+j, 1] = range_y[j]
interp_data = griddata(data_points, data_values, (grid_x, grid_y), method='cubic')
interp_data = interp_data[:, :, 0]

# compute vertices, indices and normals
vert_string = ""
for i in range(interp_data.shape[0]):
	for j in range(interp_data.shape[1]):
		vert_string += str(grid_x[i, 0])+"+"+str(interp_data[i, j])+"+"+str(grid_y[0, j])+"+"
ind_string = ""
for i in range(interp_data.shape[0]-1):
	for j in range(interp_data.shape[1]-1):
		current = i*interp_data.shape[1]+j
		ind_string += str(current)+"+"+str(current+1)+"+"+str(current+interp_data.shape[1])+"+"
		ind_string += str(current+interp_data.shape[1])+"+"+str(current+1)+"+"+str(current+interp_data.shape[1]+1)+"+"
norm_string = ""
for i in range(interp_data.shape[0]):
	for j in range(interp_data.shape[1]):
		norm_string += "0"+"+"  # TODO
		norm_string += "0"+"+"
		norm_string += "0"+"+"

# Write files
vert_file = open("audioshape_vert.txt", "w")
ind_file = open("audioshape_ind.txt", "w")
norm_file = open("audioshape_norm.txt", "w")
vert_file.write(vert_string)
ind_file.write(ind_string)
norm_file.write(norm_string)

a = 0  # breakpoint
