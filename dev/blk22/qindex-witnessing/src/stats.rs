
pub struct Variance{
	list: Vec<f64>
}

impl Variance{
	pub fn new() -> Variance{
		Variance{
			list : Vec::<f64>::new()
		}
	}

	pub fn gather(&mut self, n: f64){
		self.list.push(n);
	}

	pub fn get(&self) -> f64{
		let size = self.list.len() as f64;
		let mean = self.list.iter().fold(0.0, |acc,x| acc + x)/size;

		return self.list.iter().fold(0.0, |acc,x| acc + (x-mean)*(x-mean))/(size - 1.0);
	}
}
