use std::env;
mod source;
mod stairs;

fn main() {
	let args : Vec<String> = env::args().skip(1).collect();

	let size = args[0].parse::<i128>().unwrap();
	let fsize = args[1].parse::<i64>().unwrap();

	let mut reducer = stairs::Reducer::new();
	for item in source::get(size, fsize){
		println!("{}\t{}", reducer.next(item.clone()), item);
	}
}
