let cvs = document.getElementById('galaxy');
let cvs2 = document.getElementById('galaxy-bg');
let ctx = cvs.getContext('2d');
let ctx2 = cvs2.getContext('2d');
let ratio = window.devicePixelRatio;
let width = window.innerWidth;
let height = window.innerHeight;
let [w, h] = [width * ratio, height * ratio];
ctx.scale(ratio, ratio);
ctx2.scale(ratio, ratio);

cvs.style.width = cvs2.style.width = width + "px";
cvs.style.height = cvs2.style.height = height + "px";
cvs.width = cvs2.width = w;
cvs.height = cvs2.height = h;

// function 
let random = (max = 1, min = 0) => Math.random() * (max - min) + min;
let radialGradient = (x0, y0, r0, x1, y1, r1, colors) => (g => (colors.forEach((c, i) => g.addColorStop(i / (colors.length - 1), c)), g))(ctx
   .createRadialGradient(x0, y0, r0, x1, y1, r1));
let linearGradient = (x0, y0, x1, y1, colors) => (g => (colors.forEach((c, i) => g.addColorStop(i / (colors.length - 1), c)), g))(ctx.createLinearGradient(
   x0,
   y0, x1, y1));
let bg = (context) => {
   context.beginPath();
   context.fillStyle = '#802';
   context.fillRect(0, 0, w, h);
   context.beginPath();
   context.fillStyle = radialGradient(0, 0, 0, 0, 0, w * 2, ['#000f', '#0000']);
   context.fillRect(0, 0, w, h);
   context.beginPath();
   context.fillStyle = radialGradient(w, h, 0, w, h, w * 2, ['#000f', '#0000']);
   context.fillRect(0, 0, w, h);
   context.closePath();
}
let glow = (context) => {
   context.save();
   
   context.translate(w / 2, h / 2)
   context.rotate(-0.2)
   context.translate(-w / 2, -h / 2)
   
   context.save();
   context.scale(0.2, 0.8);
   context.translate(w * 2, h / 8);
   context.beginPath();
   context.fillStyle = radialGradient(w / 2, h / 2, 0, w / 2, h / 4, w / 2, ['#fff2', '#fff0', '#fff0']);
   context.fillRect(0, 0, w, h)
   context.beginPath();
   context.fillStyle = radialGradient(w / 2, h / 2, 0, w / 2, h * 3 / 4, w / 2, ['#fff2', '#fff0', '#fff0']);
   context.fillRect(0, 0, w, h)
   context.closePath();
   context.restore();
   
   context.save();
   context.scale(1, 0.2);
   context.translate(0, h * 2);
   context.beginPath();
   context.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
   context.fillStyle = radialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2, ['#ffff', '#0000']);
   context.fill();
   context.closePath();
   context.restore();
   
   context.restore();
}
let drawStar = (x, y, size, context) => {
   let grad = radialGradient(x, y, 0, x, y, size * 5, ['#ffff', '#fff0']);
   
   context.beginPath();
   context.arc(x, y, size, 0, 2 * Math.PI);
   context.fillStyle = '#fff';
   context.fill();
   
   context.beginPath();
   context.ellipse(x, y, size * 5, size * 0.25, 0, 0, 2 * Math.PI);
   context.fillStyle = grad;
   context.fill();
   
   context.beginPath();
   context.ellipse(x, y, size * 0.25, size * 5, 0, 0, 2 * Math.PI);
   context.fillStyle = grad;
   context.fill();
   
}
let starArr = (count) => {
   let stars = [];
   for (let i = 0; i < count; i++) {
      stars.push({
         rad: random(w/2, w/20),
         angle: random(Math.PI * 2),
      })
   }
   return stars
}
let starArrFix = (count) => {
   let stars = [];
   for (let i = 0; i < count; i++) {
      stars.push({
         x: random(w),
         y: random(h),
         size: random(1, 0.05)
      })
   }
   return stars
}

let drawBg = () => {
   bg(ctx2);
   glow(ctx2);
   let fixedStars = starArrFix(200);
   for (let s of fixedStars) {
      drawStar(s.x, s.y, s.size, ctx2);
   }
}
let drawGalaxy = () => {
   let stars = starArr(500);
   
   let galaxy = () => {
      ctx.clearRect(0, 0, w, h)
      
      ctx.save();
      ctx.translate(w / 2, h / 2)
      ctx.rotate(-0.2)
      ctx.translate(-w / 2, -h / 2)
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, w / 10, 0, Math.PI);
      ctx.fillStyle = radialGradient(w / 2, h / 2, w / 40, w / 2, h / 2, w / 20, ['#ffff', '#fff0']);
      ctx.fill();
      ctx.closePath();
      
      for (let star of stars) {
         let x = w / 2 + (star.rad) * Math.sin(star.angle);
         let y = h / 2 + (star.rad * 0.2) * Math.cos(star.angle);
         let size = 1 + Math.sqrt((x - w / 2) * (x - w / 2) + (y - h / 2) * (y - h / 2)) / Math.sqrt((w / 2) * (w / 2) + (h / 2) * (h / 2)) * (30 - 10);
         drawStar(x, y, size / 5, ctx);
         
         if (star.angle >= Math.PI * 2) {
            star.angle = 0
         } else {
            star.angle += star.rad / 200000;
         }
      }
      
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, w / 10, Math.PI, 0);
      ctx.fillStyle = radialGradient(w / 2, h / 2, w / 40, w / 2, h / 2, w / 20, ['#ffff', '#fff0']);
      ctx.fill();
      ctx.closePath();
      
      ctx.restore();
      
      requestAnimationFrame(galaxy);
   }
   galaxy();
}

drawBg();
drawGalaxy();