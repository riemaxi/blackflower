use std::env;
mod source;
mod hasher;
mod stats;

fn avg(data: String) -> f64{
	return data.bytes().fold(0.0, |acc,x| acc + (x as f64))/(data.len() as f64);
}

fn main() {
	let args : Vec<String> = env::args().skip(1).collect();

	let size = args[0].parse::<i128>().unwrap();
	let fsize = args[1].parse::<i64>().unwrap();
	let bsize = args[2].parse::<usize>().unwrap();

	let mut h = hasher::Hasher::new(bsize);
	let mut variance = stats::Variance::new();

	for item in source::get(size, fsize){
		let hash = h.next(item.clone());
		if hash != ""{
			variance.gather( avg(hash.clone()) );
			println!("{}", hash);
		}
	}

	println!();
	println!("Variance: {}", variance.get() );
}
