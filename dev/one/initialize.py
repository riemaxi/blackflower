from pathlib import Path

def path(a):
	return '/mnt/d/blackflower/storage/messaging/data-' + a

for p in range(256):
	print(path(p))
	Path(path(p)).touch()



