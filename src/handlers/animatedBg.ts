import anime from "animejs";

function startBgAnimation(color: string) {
    const body = document.querySelector('body');
    
    anime({
        duration: 10000,
        easing: 'linear',
        direction: 'alternate',
        update(anim) {
            body.style.background = `linear-gradient(${250 - anim.progress}deg, rgba(29,29,29,1) ${anim.progress < 80 ? 80 : anim.progress}%, ${color} 100%)`
        }
    })
}














export default function() {
    //subscribe and stuff...

    startBgAnimation(localStorage.getItem('hoursColor'));
}