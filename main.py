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
def isNaN(num):
    return num != num

# %% Initialization
mp3 = AudioSegment.from_mp3('Let\'s Fuck (Cristian Marchi Perfect Mix).mp3')
_, path = tempfile.mkstemp()
mp3.export(path, format="wav")
mp3.export("aaa.mp3", format="mp3")
del mp3
audio, fs = sf.read(path)
if audio.ndim == 2:
	audio = audio[:, 0]  # Keep only left channel

# %% Parameters
win_length_time = 0.08

n_bands = 6
bands_borders = np.array([20, 140, 400, 1500, 5000, 10000, 20000])
first_mid_band = 1
first_high_band = 4

upsample_freq = 4
upsample_time = 4

sanity_ground = 1.4
sanity_lights = 1.4

max_vertices_per_block = 50000


# %% program
print("\nAnalyzing Audio (1 of 2)...")
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
	z_init_matrix[:, b] = np.power(z_init_matrix[:, b] / z_init_matrix[:, b].max(), sanity_ground)


# %% interpolate
grid_x, grid_y = np.mgrid[0: 1.0000000001: 1.0 / ((n_frames - 1) * upsample_time), 0:1.0000000001:1.0 / ((n_bands - 1) * upsample_freq)]
data_values = z_init_matrix.reshape(-1, 1)
range_x = np.arange(0, 1.0000000001, 1 / (n_frames - 1))
range_y = np.arange(0, 1.0000000001, 1 / (n_bands - 1))
data_points = np.zeros((len(data_values), 2))
print("\nComputing surface (2 of 2)...")
for i in range(len(range_x)):
	for j in range(len(range_y)):
		data_points[i * len(range_y) + j, 0] = range_x[i]
		data_points[i * len(range_y) + j, 1] = range_y[j]
interp_data = griddata(data_points, data_values, (grid_x, grid_y), method='cubic')
interp_data = interp_data[:interp_data.shape[0]-1, :, 0]

n_rows = interp_data.shape[0]
n_vertex_per_row = interp_data.shape[1]
n_vertex = n_rows * n_vertex_per_row
song_duration_seconds = len(audio) / fs
vertex_sample_rate = n_rows / (len(audio) / fs)

for i in range(n_rows):
	for j in range(n_vertex_per_row):
		if isNaN(interp_data[i][j]):
			interp_data[i][j] = 0.0

# %% bass, mid, high
bass_data = np.zeros((n_rows,))
mid_data = np.zeros((n_rows,))
high_data = np.zeros((n_rows,))
for i in range(n_rows):
	for j in range(n_vertex_per_row):
		if j < first_mid_band * upsample_freq:
			bass_data[i] += interp_data[i, j]
		elif j < first_high_band * upsample_freq:
			mid_data[i] += interp_data[i, j]
		else:
			high_data[i] += interp_data[i, j]
bass_mid_high_data = np.zeros((n_rows, 3))
bass_mid_high_data[:, 0] = np.power(np.absolute(bass_data) / bass_data.max(), sanity_lights)
bass_mid_high_data[:, 1] = np.power(np.absolute(mid_data) / mid_data.max(), sanity_lights)
bass_mid_high_data[:, 2] = np.power(np.absolute(high_data) / high_data.max(), sanity_lights)


# %% compute vertices, indices and normals
current_block = 0
vertices = "var audio_ground_vert = [];\naudio_ground_vert[{0:d}] = [".format(current_block)
indices = "var audio_ground_ind = [];\naudio_ground_ind[{0:d}] = [".format(current_block)
normals = "var audio_ground_norm = [];\naudio_ground_norm[{0:d}] = [".format(current_block)
current_vertex = 0
n_vert = n_rows * n_vertex_per_row
is_last_block_row = False
is_last_row = False
last_row_vertices = ""
last_row_normals = ""
past_blocks_vertices = 0
for i in tqdm(range(n_rows)):
	for j in range(n_vertex_per_row):
		current_vertex = i * n_vertex_per_row + j
		# %% vertex
		vertices += "{0:.7f}, {1:.7f}, {2:.7f}".format(
			grid_y[0, j] - 0.5, interp_data[i, j], -grid_x[i, 0]*len(audio)/fs)
		if is_last_block_row:
			last_row_vertices += "{0:.7f}, {1:.7f}, {2:.7f}".format(
				grid_y[0, j] - 0.5, interp_data[i, j], -grid_x[i, 0] * len(audio) / fs)
		if j != n_vertex_per_row-1:
			vertices += ","
			if is_last_block_row:
				last_row_vertices += ","
		# %% index
		if (not is_last_row) & (j != n_vertex_per_row-1):
			indices += " {0:d}, {1:d}, {2:d},".format(
				current_vertex - past_blocks_vertices,
				current_vertex - past_blocks_vertices + 1,
				current_vertex - past_blocks_vertices + n_vertex_per_row)
			indices += " {0:d}, {1:d}, {2:d}".format(
				current_vertex - past_blocks_vertices + n_vertex_per_row,
				current_vertex - past_blocks_vertices + 1,
				current_vertex - past_blocks_vertices + n_vertex_per_row + 1)
			if j != n_vertex_per_row-2:
				indices += ","
		# %% normal
		left = np.array([0, 0, 0])
		left2 = np.array([0, 0, 0])
		forth = np.array([0, 0, 0])
		forth2 = np.array([0, 0, 0])
		if i != 0:
			forth = np.array([0, grid_x[1, 1]*len(audio)/fs, interp_data[i, j] - interp_data[i-1, j]])
		if i != n_rows-1:
			forth2 = np.array([0, grid_x[1, 1]*len(audio)/fs, interp_data[i+1, j] - interp_data[i, j]])
		if j != 0:
			left = np.array([-grid_y[1, 1], 0, interp_data[i, j-1] - interp_data[i, j]])
		if j != n_vertex_per_row-1:
			left2 = np.array([-grid_y[1, 1], 0, interp_data[i, j] - interp_data[i, j+1]])
		left = left + left2
		forth = forth + forth2
		normal = np.cross(forth, left)
		normal = normal / np.linalg.norm(normal)
		normals += " {0:.5f}, {1:.5f}, {2:.5f}".format(normal[0], normal[2], -normal[1])
		if is_last_block_row:
			last_row_normals += " {0:.5f}, {1:.5f}, {2:.5f}".format(normal[0], normal[2], -normal[1])
		if j != n_vertex_per_row-1:
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
	elif i == n_rows-2:
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

info = "\nvar n_vertex_per_row = {0:d};".format(n_vertex_per_row)
info += "\nvar n_rows = {0:d};".format(n_rows)
info += "\nvar n_vertex = {0:d};".format(n_rows*n_vertex_per_row)
info += "\nvar y_map = [[ "
for i in range(n_rows):
	for j in range(n_vertex_per_row):
		info += "{0:.6f}".format(interp_data[i][j])
		if j != n_vertex_per_row-1:
			info += ", "
	if i != n_rows - 1:
		info += "], ["
	else:
		info += "]];\n"
info += "\nvar song_duration_seconds = {0:.4f};".format(song_duration_seconds)
info += "\nvar vertex_sample_rate = {0:.6f};".format(vertex_sample_rate)


pattern_bass = "\nvar pattern_bass = [ "
pattern_mid = "\nvar pattern_mid = [ "
pattern_high = "\nvar pattern_high = [ "
for i in range(n_rows):
	pattern_bass += "{0:.7f}".format(bass_mid_high_data[i, 0])
	pattern_mid += "{0:.7f}".format(bass_mid_high_data[i, 1])
	pattern_high += "{0:.7f}".format(bass_mid_high_data[i, 2])
	if not (i == n_rows-1):
		pattern_bass += ", "
		pattern_mid += ", "
		pattern_high += ", "
	else:
		pattern_bass += "];"
		pattern_mid += "];"
		pattern_high += "];"


# TOKENS POSITION
start = 50  # vertex to start on
stop = 50  # stop before n vertices

# Level 0: on ground
tokens_0_rows_space = upsample_time * 2
# obj 0
tokens_00 = "\nvar tokens_00 = ["
pos_x = 0
vel_x = 0
vel_x_max = 0.1
pos_x_max = 0.45
v = start
while v < n_rows-stop:
	vel_x += (np.random.rand()-0.5) * 0.2
	if vel_x > vel_x_max:
		vel_x = vel_x_max
	elif vel_x < -vel_x_max:
		vel_x = -vel_x_max
	pos_x += vel_x
	if pos_x > pos_x_max:
		pos_x = pos_x_max
		vel_x = 0
	elif pos_x < -pos_x_max:
		pos_x = -pos_x_max
		vel_x = 0
	x_index = int((pos_x + 0.5) * n_vertex_per_row)
	tokens_00 += "[{0:.6f}, {1:.6f}, {2:.6f}]".format(
		pos_x, interp_data[v][x_index] + 0.1, -v / vertex_sample_rate)
	v += tokens_0_rows_space
	if v < n_rows-stop:
		tokens_00 += ", "
tokens_00 += "];"


# lv 1, 2, 3
tokens_123_rows_space = upsample_time * 4
# probabilities
token_lv1_prob = 0.5
token_lv2_prob = 0.3
token_lv3_prob = 0.2
lv1_mean = 2
lv1_dev = 1
lv2_mean = 4
lv2_dev = 3
lv3_mean = 6
lv3_dev = 4

#lv 1
tokens_10_prob = 1
tokens_10 = "\nvar tokens_10 = ["
tokens_11_prob = 0
tokens_11 = "\nvar tokens_11 = ["
tokens_12_prob = 0
tokens_12 = "\nvar tokens_12 = ["
#lv 2
tokens_20_prob = 1
tokens_20 = "\nvar tokens_20 = ["
tokens_21_prob = 0
tokens_21 = "\nvar tokens_21 = ["
tokens_22_prob = 0
tokens_22 = "\nvar tokens_22 = ["
#lv 3
tokens_30_prob = 1
tokens_30 = "\nvar tokens_30 = ["
tokens_31_prob = 0
tokens_31 = "\nvar tokens_31 = ["
tokens_32_prob = 0
tokens_32 = "\nvar tokens_32 = ["

v = start
while v < n_rows-stop:
	lv = np.random.rand()
	pos_x = np.random.rand() * 0.95 - 0.475
	pos_z = -v / vertex_sample_rate
	if lv < token_lv1_prob:  # lv 1
		pos_y = np.random.randn() * lv1_dev + lv1_mean
		n = np.random.rand()
		if n < tokens_10_prob:
			tokens_10 += "[{0:.6f}, {1:.6f}, {2:.6f}]".format(pos_x, pos_y, pos_z)
		elif n < tokens_10_prob+tokens_11_prob:
			tokens_11 += "[{0:.6f}, {1:.6f}, {2:.6f}]".format(pos_x, pos_y, pos_z)
		elif n < tokens_10_prob+tokens_11_prob+tokens_12_prob:
			tokens_11 += "[{0:.6f}, {1:.6f}, {2:.6f}]".format(pos_x, pos_y, pos_z)

	elif lv < token_lv1_prob+token_lv2_prob:  # lv 2
		pos_y = np.random.randn() * lv2_dev + lv2_mean
		n = np.random.rand()
		if n < tokens_20_prob:
			tokens_20 += "[{0:.6f}, {1:.6f}, {2:.6f}]".format(pos_x, pos_y, pos_z)
		elif n < tokens_20_prob+tokens_21_prob:
			tokens_21 += "[{0:.6f}, {1:.6f}, {2:.6f}]".format(pos_x, pos_y, pos_z)
		elif n < tokens_20_prob+tokens_21_prob+tokens_22_prob:
			tokens_21 += "[{0:.6f}, {1:.6f}, {2:.6f}]".format(pos_x, pos_y, pos_z)

	else:  # lv 3
		pos_y = np.random.randn() * lv3_dev + lv3_mean
		n = np.random.rand()
		if n < tokens_30_prob:
			tokens_30 += "[{0:.6f}, {1:.6f}, {2:.6f}]".format(pos_x, pos_y, pos_z)
		elif n < tokens_30_prob+tokens_31_prob:
			tokens_31 += "[{0:.6f}, {1:.6f}, {2:.6f}]".format(pos_x, pos_y, pos_z)
		elif n < tokens_30_prob+tokens_31_prob+tokens_32_prob:
			tokens_31 += "[{0:.6f}, {1:.6f}, {2:.6f}]".format(pos_x, pos_y, pos_z)

	v += tokens_123_rows_space
tokens_10 += "];"
tokens_11 += "];"
tokens_12 += "];"
tokens_20 += "];"
tokens_21 += "];"
tokens_22 += "];"
tokens_30 += "];"
tokens_31 += "];"
tokens_32 += "];"

song_data = vertices + indices + normals + info
song_data += pattern_bass + pattern_mid + pattern_high
song_data += tokens_00
song_data += tokens_10 + tokens_11 + tokens_12
song_data += tokens_20 + tokens_21 + tokens_22
song_data += tokens_30 + tokens_31 + tokens_32

# Write files
print("\nWriting...")
vert_file = open("song_data.js", "w")
vert_file.write(song_data)
