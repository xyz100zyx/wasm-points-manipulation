use wasm_bindgen::prelude::*;
use rayon::prelude::*;
use std::sync::{Arc, Mutex};

#[repr(C)]
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ColorPoint {
    pub r: u8,
    pub g: u8,
    pub b: u8,
    pub a: u8,
}

#[wasm_bindgen]
impl ColorPoint {
    #[wasm_bindgen(constructor)]
    pub fn new(r: u8, g: u8, b: u8, a: u8) -> Self {
        Self { r, g, b, a }
    }
}


#[wasm_bindgen]
pub struct ColorPoints {
    points: Vec<ColorPoint>,
}

#[wasm_bindgen]
impl ColorPoints {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { points: Vec::new() }
    }

    #[wasm_bindgen]
    pub fn generate_random_points(&mut self, count: usize, seed: Option<u64>) {
        use std::collections::hash_map::DefaultHasher;
        use std::hash::{Hash, Hasher};
        
        let base_seed = seed.unwrap_or(42);
        
        self.points = (0..count)
            .into_par_iter()
            .map(|i| {
                let mut hasher = DefaultHasher::new();
                (base_seed + i as u64).hash(&mut hasher);
                let hash = hasher.finish();
                
                ColorPoint {
                    r: ((hash >> 24) & 0xFF) as u8,
                    g: ((hash >> 16) & 0xFF) as u8,
                    b: ((hash >> 8) & 0xFF) as u8,
                    a: (hash & 0xFF) as u8,
                }
            })
            .collect();
    }

    #[wasm_bindgen]
    pub fn sort_by_r(&mut self) {
        self.points.par_sort_unstable_by_key(|p| p.r);
    }

    #[wasm_bindgen]
    pub fn sort_by_g(&mut self) {
        self.points.par_sort_unstable_by_key(|p| p.g);
    }

    #[wasm_bindgen]
    pub fn sort_by_b(&mut self) {
        self.points.par_sort_unstable_by_key(|p| p.b);
    }

    #[wasm_bindgen]
    pub fn sort_by_a(&mut self) {
        self.points.par_sort_unstable_by_key(|p| p.a);
    }

    #[wasm_bindgen]
    pub fn sort_by_all(&mut self) {
        self.points.par_sort_unstable_by(|a, b| {
            a.r.cmp(&b.r)
                .then(a.g.cmp(&b.g))
                .then(a.b.cmp(&b.b))
                .then(a.a.cmp(&b.a))
        });
    }

    #[wasm_bindgen]
    pub fn get_points_as_bytes(&self) -> Vec<u8> {
        let mut result = Vec::with_capacity(self.points.len() * 4);
        
        for point in &self.points {
            result.push(point.r);
            result.push(point.g);
            result.push(point.b);
            result.push(point.a);
        }
        
        result
    }

    #[wasm_bindgen]
    pub fn load_from_bytes(&mut self, bytes: &[u8]) {
        self.points.clear();
        
        for chunk in bytes.chunks(4) {
            if chunk.len() == 4 {
                self.points.push(ColorPoint {
                    r: chunk[0],
                    g: chunk[1],
                    b: chunk[2],
                    a: chunk[3],
                });
            }
        }
    }

    #[wasm_bindgen]
    pub fn len(&self) -> usize {
        self.points.len()
    }

    #[wasm_bindgen]
    pub fn clear(&mut self) {
        self.points.clear();
    }
}

#[wasm_bindgen]
pub fn create_points(count: usize) -> *mut ColorPoints {
    Box::into_raw(Box::new(ColorPoints::new()))
}

#[wasm_bindgen]
pub fn generate_points(ptr: *mut ColorPoints, count: usize) {
    let points = unsafe { &mut *ptr };
    points.generate_random_points(count, None);
}

#[wasm_bindgen]
pub fn sort_points(ptr: *mut ColorPoints) {
    let points = unsafe { &mut *ptr };
    points.sort_by_all();
}

#[wasm_bindgen]
pub fn get_points_data(ptr: *const ColorPoints) -> Vec<u8> {
    let points = unsafe { &*ptr };
    points.get_points_as_bytes()
}

#[wasm_bindgen]
pub fn free_points(ptr: *mut ColorPoints) {
    if !ptr.is_null() {
        unsafe {
            drop(Box::from_raw(ptr));
        }
    }
}