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


# %% Initialization
mp3 = AudioSegment.from_mp3('letsfuck.mp3')
_, path = tempfile.mkstemp()
mp3.export(path, format="wav")
del mp3
audio, fs = sf.read(path)
if audio.ndim == 2:
	audio = audio[:, 0]  # Keep only left channel

# %% Parameters
n_bands = 5
bands_borders = np.array([20, 140, 500, 1000, 4000, 20000])
# bands_borders = np.array([20, 800, 2000, 5000, 10000, 20000])
upsample_freq = 5
win_length_time = 0.1
upsample_time = 5
sanity = 1.7

# %% program
print("\nComputing audio spectrum...")
win_length_samples = int(win_length_time * fs)
n_frames = int(len(audio) / win_length_samples) - 1
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
	z_init_matrix[:, b] = np.power(z_init_matrix[:, b] / z_init_matrix[:, b].max(), sanity)


# %% interpolate
grid_x, grid_y = np.mgrid[0: 1.0000000001: 1.0 / ((n_frames - 1) * upsample_time), 0:1.0000000001:1.0 / ((n_bands - 1) * upsample_freq)]
data_values = z_init_matrix.reshape(-1, 1)
range_x = np.arange(0, 1.0000000001, 1 / (n_frames - 1))
range_y = np.arange(0, 1.0000000001, 1 / (n_bands - 1))
data_points = np.zeros((len(data_values), 2))
print("\nInterpolating...")
for i in range(len(range_x)):
	for j in range(len(range_y)):
		data_points[i * len(range_y) + j, 0] = range_x[i]
		data_points[i * len(range_y) + j, 1] = range_y[j]
interp_data = griddata(data_points, data_values, (grid_x, grid_y), method='cubic')
interp_data = interp_data[:interp_data.shape[0]-1, :, 0]

# %% compute vertices, indices and normals
print("\nComputing vertices, indices and normals...")
max_vertices_per_block = 40000
current_block = 0
vertices = "var audio_ground_vert = [];\naudio_ground_vert[{0:d}] = [".format(current_block)
indices = "var audio_ground_ind = [];\naudio_ground_ind[{0:d}] = [".format(current_block)
normals = "var audio_ground_norm = [];\naudio_ground_norm[{0:d}] = [".format(current_block)
current_vertex = 0
n_vert = interp_data.shape[0] * interp_data.shape[1]
is_last_block_row = False
is_last_row = False
last_row_vertices = ""
last_row_normals = ""
past_blocks_vertices = 0
for i in tqdm(range(interp_data.shape[0])):
	for j in range(interp_data.shape[1]):
		current_vertex = i * interp_data.shape[1] + j
		# %% vertex
		vertices += "{0:.5f}, {1:.5f}, {2:.5f}".format(
			grid_y[0, j] - 0.5, interp_data[i, j], -grid_x[i, 0]*len(audio)/fs)
		if is_last_block_row:
			last_row_vertices += "{0:.5f}, {1:.5f}, {2:.5f}".format(
				grid_y[0, j] - 0.5, interp_data[i, j], -grid_x[i, 0] * len(audio) / fs)
		if j != interp_data.shape[1]-1:
			vertices += ","
			if is_last_block_row:
				last_row_vertices += ","
		# %% index
		if (not is_last_row) & (j != interp_data.shape[1]-1):
			indices += " {0:d}, {1:d}, {2:d},".format(
				current_vertex - past_blocks_vertices,
				current_vertex - past_blocks_vertices + 1,
				current_vertex - past_blocks_vertices + interp_data.shape[1])
			indices += " {0:d}, {1:d}, {2:d}".format(
				current_vertex - past_blocks_vertices + interp_data.shape[1],
				current_vertex - past_blocks_vertices + 1,
				current_vertex - past_blocks_vertices + interp_data.shape[1] + 1)
			if j != interp_data.shape[1]-2:
				indices += ","
		# %% normal
		left = np.array([0, 0, 0])
		left2 = np.array([0, 0, 0])
		forth = np.array([0, 0, 0])
		forth2 = np.array([0, 0, 0])
		if i != 0:
			forth = np.array([0, grid_x[1, 1]*len(audio)/fs, interp_data[i, j] - interp_data[i-1, j]])
		if i != interp_data.shape[0]-1:
			forth2 = np.array([0, grid_x[1, 1]*len(audio)/fs, interp_data[i+1, j] - interp_data[i, j]])
		if j != 0:
			left = np.array([-grid_y[1, 1], 0, interp_data[i, j-1] - interp_data[i, j]])
		if j != interp_data.shape[1]-1:
			left2 = np.array([-grid_y[1, 1], 0, interp_data[i, j] - interp_data[i, j+1]])
		left = left + left2
		forth = forth + forth2
		normal = np.cross(forth, left)
		normal = normal / np.linalg.norm(normal)
		normals += " {0:.5f}, {1:.5f}, {2:.5f}".format(normal[0], normal[2], -normal[1])
		if is_last_block_row:
			last_row_normals += " {0:.5f}, {1:.5f}, {2:.5f}".format(normal[0], normal[2], -normal[1])
		if j != interp_data.shape[1]-1:
			normals += ","
			if is_last_block_row:
				last_row_normals += ","
	if is_last_block_row:
		is_last_block_row = False
		if not is_last_row:
			vertices += " ];\naudio_ground_vert[{0:d}] = [ {1:s} ".format(current_block, last_row_vertices)
			normals += " ];\naudio_ground_norm[{0:d}] = [ {1:s} ".format(current_block, last_row_normals)
			last_row_vertices = ""
			last_row_normals = ""
			indices += ","
			vertices += ","
			normals += ","
		else:
			vertices += " ];\n"
			normals += " ];\n"
	elif i == interp_data.shape[0]-2:
		is_last_row = True
		is_last_block_row = True
		indices += " ];\n"
		vertices += ","
		normals += ","
	elif current_vertex-past_blocks_vertices > max_vertices_per_block:  # block size exceeded
		is_last_block_row = True
		current_block += 1
		indices += " ];\naudio_ground_ind[{0:d}] = [ ".format(current_block)
		vertices += ","
		normals += ","
		past_blocks_vertices = current_vertex + 1
	else:
		vertices += ","
		normals += ","
		indices += ","

info = "var n_vertex_per_row = {0:d};\n".format(interp_data.shape[1])
info += "var n_rows = {0:d};\n".format(interp_data.shape[0])
info += "var n_vertex = {0:d};\n".format(interp_data.shape[0]*interp_data.shape[1])
info += "var y_map = [[ "
for i in range(interp_data.shape[0]):
	for j in range(interp_data.shape[1]):
		info += "{0:.6f}".format(interp_data[i][j])
		if j != interp_data.shape[1]-1:
			info += ", "
	if i != interp_data.shape[0] - 1:
		info += "], ["
	else:
		info += "]];\n"
info += "var song_duration_seconds = {0:.2f};".format(len(audio) / fs)
info += "var vertex_fs = {0:.4f};".format(interp_data.shape[0] / (len(audio) / fs))


song_data = vertices + indices + normals + info
# Write files
print("\nWriting...")
vert_file = open("song_data.js", "w")
vert_file.write(song_data)
