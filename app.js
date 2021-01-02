let controller;
let slideScene;
let pageScene;

function animateSlides(){

    controller = new ScrollMagic.Controller();

    const slider = document.querySelectorAll(".slide");
    const nav = document.querySelectorAll(".nav-header");

    slider.forEach((slide , index, slides) =>{
        const revealImg = slide.querySelector(".reveal-img");
        const img = slide.querySelector("img");
        const revealText = slide.querySelector(".reveal-text");

        //GSAP
        const slideT1 = gsap.timeline({
            defaults: {
                duration: 1 ,
                ease: "power2"
            }
        });
        slideT1.fromTo(revealImg , {x : "0%"} , {x: "100%"});
        slideT1.fromTo(img , { scale:"2"} , {scale:"1"} , "-=1");
        slideT1.fromTo(revealText , {x: "0%"} , {x: "100%"}  , "-=0.75");
        slideT1.fromTo(nav ,0.75 ,{ y:"-100%"} , {y:"0%"} , "-=0.6");
        

        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.5,
            reverse: false
        })
        .setTween(slideT1)
        .addIndicators({
            colorStart: "white",
            colorTrigger: "white",
            name: "slide"
        })
        .addTo(controller);


        const pageTl = gsap.timeline();
        let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
        pageTl.fromTo(nextSlide , { y: "0%"} , { y: "50%" });
        pageTl.fromTo(slide , {opacity:1, scale:1} , {opacity: 0 , scale : 0.6});   
        pageTl.fromTo(nextSlide , { y: "50%"} , { y: "0%" } , "-=0.5");


        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: "100%",
            triggerHook: 0
        })
        .addIndicators({
            colorStart: "white",
            colorTrigger: "white",
            name: "page",
            indent: "200"
        })
        .setPin(slide , {pushFollowers: false })
        .setTween(pageTl)
        .addTo(controller);
    });
}

const mouse = document.querySelector(".cursor");
const mouseText = mouse.querySelector("span");
const burger = document.querySelector(".burger");

function cursor(e){
    mouse.style.top = e.pageY + "px";
    mouse.style.left = e.pageX + "px";
}

function activecursor(e){
    
    const item = e.target;
    if(item.id == "logo" || item.classList.contains("burger")){
        mouse.classList.add("nav-active");
    }else{
        mouse.classList.remove("nav-active");
    }
    if(item.classList.contains("explore")){
        mouse.classList.add("explore-active");
        gsap.to(".title-swipe" , 1 , { y : "0%"});
        mouseText.innerText = "Tap";
    }else{
        mouse.classList.remove("explore-active");
        gsap.to(".title-swipe" , 1 , { y : "100%"});
        mouseText.innerText = "";
    } 
}

function navToggle(e) {
    if (!e.target.classList.contains("active")) {
      e.target.classList.add("active");
      gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
      gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "black" });
      gsap.to("#logo", 1, { color: "black" });
      gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
      document.body.classList.add("hide");
    } else {
      e.target.classList.remove("active");
      gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
      gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
      gsap.to("#logo", 1, { color: "white" });
      gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
      document.body.classList.remove("hide");
    }
  }


//Barba Page Transistions
barba.init({
    views:[
        {
            namespace: 'home',
            beforeEnter(){
                animateSlides();
            },
            beforeLeave(){
               slideScene.destroy();
               pageScene.destroy();
               controller.destroy(); 
            }
        },
        {
            namespace: "fashion"
        }
    ],
    transitions:[
        {
            leave({current , next}){
                let done = this.async();

                const t1 = gsap.timeline({defaults: { ease: "power2.inOut"}});
                t1.fromTo(current.container , 0.5, {opacity : 1} , {opacity: 0 , onComplete : done});
            },
            enter({current , next}){

                let done = this.async();

                window.scrollTo (0,0);

                const t1 = gsap.timeline({defaults: { ease: "power2.inOut"}});
                t1.fromTo(next.container , 0.5 , {opacity : 0} , {opacity: 1 , onComplete : done});
            }
        }
    ]
})

burger.addEventListener('click' , navToggle);
window.addEventListener('mousemove' , cursor);
window.addEventListener("mouseover" , activecursor);
