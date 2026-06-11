use std::future::Future;
use std::pin::{pin, Pin};
use std::sync::{Arc, Mutex};
use std::task::{Context, Poll, Waker};


// two ends
struct Sender   { inner: Arc<Mutex<Inner>> }
struct Receiver { inner: Arc<Mutex<Inner>> }

//Inner, the shared state
struct Inner {
    value: Option<String>,
    waker: Option<Waker>
}

fn oneshot() -> (Sender, Receiver){
    let inner = Arc::new(Mutex::new(Inner{value: None, waker: None}));
    (Sender{inner:inner.clone()} , Receiver{inner})
}

impl Sender {
    fn send(self, value: String) {
        let mut inner = self.inner.lock().unwrap(); 
        inner.value = Some(value);
        if let Some(waker) = inner.waker.take() {
            waker.wake();
        }
        
    }
    
}

impl Future for Receiver {
    type Output = String;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        let mut inner = self.inner.lock().unwrap();
        if let Some(value) = inner.value.take() {
            Poll::Ready(value)
        }
        else {
            inner.waker = Some(cx.waker().clone());
            Poll::Pending
        }
    }
    
}

fn main(){
    println!("The one shot channel is ready to be implemented");
    
}
