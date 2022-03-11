
pub struct Variance{
	list: Vec<f64>
}

impl Variance{
	pub fn new() -> Variance{
		Variance{
			list: Vec::<f64>::new()
		}
	}

	pub fn gather(&mut self, n: f64){
		self.list.push(n)
	}

	pub fn get(&self) -> f64{
		let size = self.list.len() as f64;
		let mean = self.list.iter().fold(0.0, |acc,x| acc + x)/size;

		return self.list.iter().fold(0.0, |acc,x| acc + (x-mean)*(x-mean))/(size - 1.0);
	}
}


pub struct Witnessing{
	list: Vec<f64>
}

impl Witnessing{
	pub fn new() -> Witnessing{
		Witnessing{
			list: Vec::<f64>::new()
		}
	}

	pub fn gather(&mut self, n: f64){
		self.list.push(n);
	}

	pub fn get(&self) -> f64{
		return self.list.len() as f64;
	}

}

pub struct Quality{
	list: [f64;16],
	size: usize
}

impl Quality{
	pub fn new() -> Quality{
		Quality{
			list: [0.0;16],
			size: 0
		}
	}

	fn position(&self, x: u8) -> usize{
		return if x<65 { x-48} else { x-55} as usize
	}

	pub fn gather(&mut self, data: String){
		for a in data.bytes(){
			self.list[ self.position(a) ] += 1.0
		}
		self.size += 16
	}

	fn value(&self, x: f64) -> f64{
		let p = x/(self.size as f64);
		return p * p.log10() 
	}

	pub fn get(&self) -> f64{
		return -self.list.iter().fold(0.0, |acc, x| acc + self.value(*x));
	}

}
