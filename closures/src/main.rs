// closures are like functions but without a name , they can be stored as variables and could be passed around
// can be passed as input parameters and capture the variable inside the scope

use std::{thread, time::Duration};

fn simulated_expensive_calculation(intensity: u32) -> u32 {
    println!("calculating slowly....");
    thread::sleep(Duration::from_secs(3));
    intensity
}

fn main(){
    let  simulated_intensity =  10;
    let simulated_random_number = 7;

    generate_workout(simulated_intensity, simulated_random_number)
 
}

struct Cacher<T> 
where T: Fn(u32) -> u32,
{
    calculation: T,
    value: Option<u32>,
}

impl <T> Cacher<T> {
    where    
}

fn generate_workout(intensity: u32, random_number: u32) {

    let expensive_closure = |num| -> u32 {
        println!("calculating slowly...");
        thread::sleep(Duration::from_secs(3));
        num
    };

    let example_closure = |x| x;

    let s = example_closure(String::from("hello"));
    let n = example_closure(5);

    if intensity < 25 {
        println!(
            "Today, do {} pushups!",
            expensive_closure(intensity)
            );
        println!(
            "Next, do {} situps!",
            expensive_closure(intensity)
        );
    }
    else {
        if random_number == 3 {
            println!("Take a break today! Remember to stay hydrated!")

        }
        else{
            println!("Today, run for {} minutes!",
            simulated_expensive_calculation(intensity)
             );
        }
    }

    
}