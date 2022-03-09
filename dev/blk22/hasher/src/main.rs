use std::env;
mod source;
mod hasher;

fn main() {
	let args : Vec<String> = env::args().skip(1).collect();

	let size = args[0].parse::<i128>().unwrap();
	let fsize = args[1].parse::<i64>().unwrap();
	let bsize = args[2].parse::<usize>().unwrap();

	let mut h = hasher::Hasher::new(bsize);
	for item in source::get(size, fsize){
		let hash = h.next(item.clone());
		if hash != ""{
			println!("{}", hash);
		}
	}
}
