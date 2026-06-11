use std::env;
use std::process;
use true_search::Config;


fn main(){
    let args: Vec<String> = env::args().collect();

    let config = Config::build(&args).unwrap_or_else(|err|{
        eprintln!("Problem parsing arguments: {err}");
        process::exit(1);
    });

    if let Err(e) =  true_search::run(config){
        eprintln!("App Error: {e}");
        process::exit(1)
        
    }
    
}