use sha2::Digest;

pub struct Hasher{
	block_size: usize,
	current_size: usize,
	hash: String,
	data: String
}

impl Hasher{
	pub fn new(block_size: usize) -> Hasher{
		Hasher{
			block_size: block_size,
			current_size: block_size,
			hash: String::new(),
			data: String::new()
		}
	}


	fn process(&mut self, data: String) -> String{
		self.data += &data.to_string();
		self.current_size -= 1;

		if self.current_size == 0{
			self.current_size = self.block_size;
			self.data = "".to_string();

			self.hash = format!("{:X}",sha2::Sha256::digest(self.hash.to_string() + &self.data));

			return self.hash.to_string();
		}else{
			return "".to_string();
		}

	}

	pub fn next(&mut self, data: String) -> String{
		return self.process( data.to_string() );
	}
}
