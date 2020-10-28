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
mp3 = AudioSegment.from_mp3('nnn.mp3')
_, path = tempfile.mkstemp()
mp3.export(path, format="wav")
del mp3
audio, fs = sf.read(path)
if audio.ndim == 2:
	audio = audio[:, 0]

# Parameters
n_bands = 7
bands_borders = np.array([20, 1000, 2000, 4000, 6000, 9000, 12000, 20000])
# bands_borders = np.array([20, 600, 2000, 4000, 10000, 20000])
upsample_freq = 4
win_length_time = 0.1
upsample_time = 4

# program
print("Computing audio spectrum...")
win_length_samples = int(win_length_time * fs)
n_frames = int(len(audio) / win_length_samples) - 2
z_init_matrix = np.zeros((n_frames, n_bands))
z_matrix = np.zeros((n_frames * upsample_time, (n_bands - 1) * upsample_freq + 1))
audio_length_time = len(audio) / fs
for f in tqdm(range(n_frames)):
	frame = audio[(f * win_length_samples): np.min([f * win_length_samples + win_length_samples, len(audio)])]
	for b in range(n_bands):
		lowcut = bands_borders[b]
		highcut = bands_borders[b + 1]
		filtered_frame = butter_bandpass_filter(frame, lowcut, highcut, fs, 3)
		rms = np.sqrt(sum(np.power(filtered_frame, 2)))
		z_init_matrix[f, b] = rms
for b in range(n_bands):
	z_init_matrix[:, b] = np.sqrt(z_init_matrix[:, b] / z_init_matrix[:, b].max())

# interpolate
print("Interpolating...")
grid_x, grid_y = np.mgrid[0: 1.00000001: 1.0 / ((n_frames - 1) * upsample_time), 0:1.0000000001:1.0 / ((n_bands - 1) * upsample_freq)]
data_values = z_init_matrix.reshape(-1, 1)
range_x = np.arange(0, 1.0000001, 1 / (n_frames - 1))
range_y = np.arange(0, 1.0000001, 1 / (n_bands - 1))
data_points = np.zeros((len(data_values), 2))
for i in tqdm(range(len(range_x))):
	for j in range(len(range_y)):
		data_points[i * len(range_y) + j, 0] = range_x[i]
		data_points[i * len(range_y) + j, 1] = range_y[j]
interp_data = griddata(data_points, data_values, (grid_x, grid_y), method='cubic')
interp_data = interp_data[:, :, 0]

# compute vertices, indices and normals
print("Computing vertices...")
audio_ground = " var audio_ground_vert = ["
for i in tqdm(range(interp_data.shape[0])):
	for j in range(interp_data.shape[1]):
		audio_ground += "{0:.9f}, {1:.9f}, {2:.9f}".format(grid_y[0, j] - 0.5, interp_data[i, j], -grid_x[i, 0]*len(audio)/fs)
		if (i == interp_data.shape[0] - 1) & (j == interp_data.shape[1] - 1):
			audio_ground += "];"
		else:
			audio_ground += ", "
print("Computing indices...")
audio_ground += " var audio_ground_ind = ["
for i in tqdm(range(interp_data.shape[0] - 1)):
	for j in range(interp_data.shape[1] - 1):
		current = i * interp_data.shape[1] + j
		audio_ground += "{0:d}, {1:d}, {2:d},".format(
			current, current + 1, current + interp_data.shape[1])
		audio_ground += "{0:d}, {1:d}, {2:d}".format(
			current + interp_data.shape[1], current + 1, current + interp_data.shape[1] + 1)
		if (i == interp_data.shape[0] - 2) & (j == interp_data.shape[1] - 2):
			audio_ground += "];"
		else:
			audio_ground += ", "
print("Computing normals...")
audio_ground += " var audio_ground_norm = ["
for i in tqdm(range(interp_data.shape[0])):
	for j in range(interp_data.shape[1]):
		nx = 0
		dx = 0
		dy = 0 if i == 0 else interp_data[i, j] - interp_data[i-1, j]
		ny = 0
		nz = 0
		# audio_ground_definition += "{0:.6f}, {1:.6f}, {2:.6f}".format(np.random.rand(), np.random.rand(), np.random.rand())
		audio_ground += "0, 1, 0"
		if (i == interp_data.shape[0] - 1) & (j == interp_data.shape[1] - 1):
			audio_ground += "];"
		else:
			audio_ground += ", "
# Write files
print("Writing...")
vert_file = open("audio_ground.js", "w")
vert_file.write(audio_ground)

a = 0  # breakpoint
