pub struct Reducer{
	lagging: i64
}

impl Reducer{
	pub fn new() -> Reducer{
		Reducer{
			lagging: 0
		}
	}

	fn leap(&mut self, value: u8) -> i64{
		return value as i64
	}


	fn process(&mut self, data: String) -> i64{
		let sum : i64 = data.bytes().map(|x| self.leap(x)).sum();

		let size = 2*(data.len() as i64);
		let result = (sum + self.lagging)/size;

		self.lagging = sum;

		return result;

	}

	pub fn next(&mut self, data: String) -> i64{
		return self.process( data.to_string() );
	}
}
