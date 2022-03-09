use rand::random;

fn fragment(size: i64) -> String{
	let symbol = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let max_pos = symbol.to_string().len();

	let mut data: String =  String::new();
	for _ in 0..size{
		let pos : usize = random::<usize>() % max_pos;
		data.push( symbol.chars().nth(pos.into()).unwrap() );
	}

	return data;

}

pub struct Source{
	size: i128,
	fragment_size: i64
}

impl Iterator for Source{
	type Item = String;

	fn next(&mut self) -> Option<Self::Item>{
		let current = fragment(self.fragment_size);
		self.size -= 1;
		if self.size >= 0{
			Some(current)
		}else{
			None
		}
		
	}
}

pub fn get(size: i128, fragment_size: i64) -> Source{
	Source{ size: size, fragment_size: fragment_size }
}
