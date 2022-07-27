import json

template = '{:064x}'

def partition(a,b):
	data = {'id' : 'data-{:03}'.format(a),'path' : '/mnt/d/blackflower/storage/messaging/data-' + '{:03}'.format(a),'range' : {'start' : '{:064x}'.format(2 ** a - 1),'end' : '{:064x}'.format(2 ** b - 1)}}

	return data

partitions = []
for p in range(256):
	partitions.append(partition(p, p+1))

print( json.dumps(partitions, indent = 4) )
