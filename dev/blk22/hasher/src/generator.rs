
use rand::random;

fn print_fragment(size: i64){
	let symbol = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let max_pos = symbol.to_string().len();

	for _ in 0..size{
		let pos : usize = random::<usize>() % max_pos;
		print!("{}",symbol.chars().nth(pos.into()).unwrap());
	}
}

pub fn run(size: i64, fsize: i64){
	for _ in 0..size{
		print_fragment(fsize);
		println!();

	}
}
