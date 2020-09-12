var gulp            = require('gulp');
var path            = require('path');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var sourcemaps      = require('gulp-sourcemaps');
var rename          = require('gulp-rename');
var open            = require('gulp-open');


/*
---------------------------------------------------------------------------------------
กำหนด variable ของ Paths ที่ต้องใช้บ่อย ๆ จะได้แก้ที่นี่ที่เดียวจบ
--------------------------------------------------------------------------------------- */
var Paths = {
  HERE: './',
  DIST: 'dist/',
  CSS: './assets/css/',
  SCSS_TOOLKIT_SOURCES: './assets/scss/material-kit.scss',
  SCSS: './assets/scss/**/**'
};


/*
---------------------------------------------------------------------------------------
Compile sass into CSS แบบมาตรฐานปกติ คือไม่มีการบีบอัด พร้อมกับทำ sourcemap ให้มันด้วย
---------------------------------------------------------------------------------------
กำหนด task ชื่อว่า compile-scss เพื่อใช้สำหรับ complile sass ไปเป็น css แบบมาตรฐานปกติ
สิ่งที่เราจะได้คือไฟล์ xxxxx.css และไฟล์ xxxxx.css.map
โดยที่ xxxxx คือชื่อไฟล์ที่เรากำหนดได้เอง หรือจะเอาชื่อเดียงกับ scss ต้นทางก็ได้
--------------------------------------------------------------------------------------- */
gulp.task('compile-scss', function () {

  // กำหนดตำแหน่งที่ตั้งของไฟล์ scss ต้นทาง
  // ให้ระบุ path ต้นทางลงไปใน return gulp.src(ตำแหน่งที่ตั้งของไฟล์ scss ต้นทาง)
  return gulp.src(Paths.SCSS_TOOLKIT_SOURCES)

    // เริ่มกระบวนการกำหนดหรือตั้งชื่อไฟล์ .css และ .css.map ที่ต้องการ
    // ถ้าต้องการใช้ชื่อไฟล์เหมือนกับไฟล์ scss ต้นทาง ให้ปล่อยค่า prefix , basename , suffix ว่าง ๆ เอาไว้
    // ถ้าต้องการเปลี่ยนชื่อไฟล์ สามารถกำหนด basename (ชื่อไฟล์) , prefix (คำนำหน้า) , suffix (คำต่อท้าย)
    .pipe(rename({
      prefix: '',
      basename: 'material-kit',
      suffix: ''
    }))

    // sourcemaps จะเริ่มต้นจากตรงนี้ (initial sourcemaps)
    .pipe(sourcemaps.init())

    // เริ่มกระบวนการ compile sass ไปเป็น css
    // กำหนดรูปแบบของ output style เป็นแบบ expanded เพราะต้องการให้ css ที่ได้มีรูปแบบที่เป็นมาตรฐานจริง Bootstrap ให้อ่านง่าย และสวยงาม
    // กำหนดรูปแบบของ precision หรือความละเอียดเมื่อมีการคำนวณบวกลบคูณหารใน scss โดยใช้ทศนิยม 6 ตำแหน่ง ตามมาตรฐานจริง Bootstrap
    .pipe(sass({ // compile sass to css with option expanded.
      outputStyle: 'expanded',
      precision: 6,
      errLogToConsole: true
    }).on('error', sass.logError))

    // เริ่มกระบวนการ autoprefix หรือการทำให้ css ที่ได้ รองรับ Browser รุ่นที่เราต้องการ
    // โดยปกติแล้ว autoprefixer() ตาม default ที่ไม่กำหนด browsers อะไรลงไป จะหมายถึง > 0.5%, last 2 versions, Firefox ESR, not dead
    // เราควรกำหนด browsers ให้ตอบรับความเป็นจริงปัจจุบัน เพราะทุกวันนี้ ปี 2020 พบว่ายังมีคนใช้ IE8 , IOS 9.5 , Android 4 อยู่จำนวนไม่น้อย
    // เราสามารถตรวจสอบสถิติ OS, Resolution, Browser Version ดูได้ทั่วโลก มีไทยด้วย http://gs.statcounter.com/browser-market-share
    // วิธีการกำหนด พารามิเตอร์ และ ตัวแปรของ autoprefixer({ browsers: [] }) ให้อ้างอิงจาก https://github.com/browserslist/browserslist
    // สำหรับ Bootstrap 3 ของจริง ดูได้ที่ https://github.com/twbs/bootstrap/blob/v3.3.7/grunt/configBridge.json
    .pipe(autoprefixer({
      browsers: [
        '>= 0.01%',
        'last 4 versions',
        'Edge >= 12',
        'ie_mob >= 10',
        'Android 2.3',
        'Android >= 4',
        'Chrome >= 20',
        'Firefox >= 24',
        'Explorer >= 8',
        'iOS >= 6',
        'Opera >= 12',
        'Safari >= 6'
      ]
    }))

    // ต้องการบันทึก sourcemaps ที่ได้จากกกระบวนการด้านบนไว้ที่ไหน ก็ใส่ลงไปใน sourcemaps.write(ตำแหน่งที่ตั้งของไฟล์ .css.map ปลายทางที่ต้องการ)
    // สำหรับชื่อไฟล์ที่ได้ เช่น style.css.map หรือ main.css.map จะอ้างอิงจาก pipe(rename({}) ที่เรากำหนดไว้ใน task อันนี้
    .pipe(sourcemaps.write(Paths.HERE))

    // ต้องการบันทึก css ที่ได้จากกกระบวนการด้านบนไว้ที่ไหน ก็ใส่ลงไปใน gulp.dest(ตำแหน่งที่ตั้งของไฟล์ .css ปลายทางที่ต้องการ)
    // สำหรับชื่อไฟล์ที่ได้ เช่น style.css หรือ main.css จะอ้างอิงจาก pipe(rename({}) ที่เรากำหนดไว้ใน task อันนี้
    .pipe(gulp.dest(Paths.CSS));

});


/*
---------------------------------------------------------------------------------------
Compile sass into CSS แบบบีบอัดข้อมูลให้มีขนาดเล็ก เพื่อใช้งาน Production จริง
---------------------------------------------------------------------------------------
กำหนด task ชื่อว่า minify-scss เพื่อใช้สำหรับ complile sass ไปเป็น css แบบบีบอัดไฟล์
สิ่งที่เราจะได้คือไฟล์ xxxxx.min.css
โดยที่ xxxxx คือชื่อไฟล์ที่เรากำหนดได้เอง หรือจะเอาชื่อเดียงกับ scss ต้นทางก็ได้
วิธีนี้ได้ผลแน่นอน ทำเหมือนตอน compile sass เกือบทุกอย่าง แตกต่างกันเพียงแค่
1) เราจะไม่ทำ sourcemap ให้กับ .min.css
2) เราจะใช้ outputStyle แบบ 'compressed' (บีบอัดข้อมูล) แทนที่ 'expanded' (ขยายให้สวยงาม)
3) เราจะเปลี่ยนชื่อไฟล์ที่ได้ โดยให้มี min เป็น suffix (คำต่อท้าย) เช่น style.min.css หรือ main.min.css
--------------------------------------------------------------------------------------- */
gulp.task('minify-scss', function () {

  // กำหนดตำแหน่งที่ตั้งของไฟล์ scss ต้นทาง
  // ให้ระบุ path ต้นทางลงไปใน return gulp.src(ตำแหน่งที่ตั้งของไฟล์ scss ต้นทาง)
  return gulp.src(Paths.SCSS_TOOLKIT_SOURCES)

    // เริ่มกระบวนการกำหนดหรือตั้งชื่อไฟล์ .css และ .css.map ที่ต้องการ
    // ถ้าต้องการใช้ชื่อไฟล์เหมือนกับไฟล์ scss ต้นทาง ให้ปล่อยค่า prefix , basename , suffix ว่าง ๆ เอาไว้
    // ถ้าต้องการเปลี่ยนชื่อไฟล์ สามารถกำหนด basename (ชื่อไฟล์) , prefix (คำนำหน้า) , suffix (คำต่อท้าย)
    // ในกรณี minify ตามมาตรฐานสากล เราจะเปลี่ยนชื่อไฟล์ที่ได้ให้มี min เป็น suffix (คำต่อท้าย) เสมอ
    .pipe(rename({
      prefix: '',
      basename: 'material-kit',
      suffix: '.min'
    }))

    // เริ่มกระบวนการ compile sass ไปเป็น css
    // กำหนดรูปแบบของ output style เป็นแบบ compressed เพราะต้องการให้ css ที่ได้มีขนาดเล็กจบในบรรทัดเดียว แบบ minify ที่ต้องการ
    // กำหนดรูปแบบของ precision หรือความละเอียดเมื่อมีการคำนวณบวกลบคูณหารใน scss โดยใช้ทศนิยม 6 ตำแหน่ง ตามมาตรฐานจริง Bootstrap
    .pipe(sass({ // compile sass to css with option expanded.
      outputStyle: 'compressed',
      precision: 6,
      errLogToConsole: true
    }).on('error', sass.logError))

    // เริ่มกระบวนการ autoprefix หรือการทำให้ css ที่ได้ รองรับ Browser รุ่นที่เราต้องการ
    // โดยปกติแล้ว autoprefixer() ตาม default ที่ไม่กำหนด browsers อะไรลงไป จะหมายถึง > 0.5%, last 2 versions, Firefox ESR, not dead
    // เราควรกำหนด browsers ให้ตอบรับความเป็นจริงปัจจุบัน เพราะทุกวันนี้ ปี 2020 พบว่ายังมีคนใช้ IE8 , IOS 9.5 , Android 4 อยู่จำนวนไม่น้อย
    // เราสามารถตรวจสอบสถิติ OS, Resolution, Browser Version ดูได้ทั่วโลก มีไทยด้วย http://gs.statcounter.com/browser-market-share
    // วิธีการกำหนด พารามิเตอร์ และ ตัวแปรของ autoprefixer({ browsers: [] }) ให้อ้างอิงจาก https://github.com/browserslist/browserslist
    // สำหรับ Bootstrap 3 ของจริง ดูได้ที่ https://github.com/twbs/bootstrap/blob/v3.3.7/grunt/configBridge.json
    .pipe(autoprefixer({
      browsers: [
        '>= 0.01%',
        'last 4 versions',
        'Edge >= 12',
        'ie_mob >= 10',
        'Android 2.3',
        'Android >= 4',
        'Chrome >= 20',
        'Firefox >= 24',
        'Explorer >= 8',
        'iOS >= 6',
        'Opera >= 12',
        'Safari >= 6'
      ]
    }))

    // ต้องการบันทึก css ที่ได้จากกกระบวนการด้านบนไว้ที่ไหน ก็ใส่ลงไปใน gulp.dest(ตำแหน่งที่ตั้งของไฟล์ .css ปลายทางที่ต้องการ)
    // สำหรับชื่อไฟล์ที่ได้ เช่น style.min.css หรือ main.min.css จะอ้างอิงจาก pipe(rename({}) ที่เรากำหนดไว้ใน task อันนี้
    .pipe(gulp.dest(Paths.CSS));

});


/*
---------------------------------------------------------------------------------------
ติดตามการเปลี่ยนแปลงว่ามีการแก้ไขไฟล์ scss หรือไม่ ถ้ามีการแก้จะให้ทำอะไรก็กำหนดลงไปในนี้
---------------------------------------------------------------------------------------
กำหนด task ชื่อว่า watch
เพื่อใช้สำหรับเฝ้าดูการเปลี่ยนแปลงของไฟล์ที่กำหนดใน gulp.watch หากพบว่าเปลี่ยนให้ทำ task ที่อยู่ใน gulp.series
รูปแบบของ gulp.watch(A ,B) หมายถึง เฝ้าดูการเปลี่ยนแปลงของไฟล์ที่อยู่ใน A ถ้าพบการเปลี่ยนแปลงให้ทำ B
ซึ่ง B จะกำหนดให้เป็น series งานแบบอนุกรม คือ ทำ task ตามที่กำหนดแบบเรียงลำดับ
จากตัวอย่างที่ทำด้านล่างจะหมายถึง ถ้าพบว่ามีการแก้ไข scss ใด ๆ ใน patch ที่กำหนดไว้
ให้ทำ task งานตาม series ได้เลย คือ Run task งาน compile-scss และ Run task งาน minify-scss
--------------------------------------------------------------------------------------- */
gulp.task('watch', function () {
  gulp.watch(Paths.SCSS, gulp.series('compile-scss', 'minify-scss'));
});


/*
---------------------------------------------------------------------------------------
เปิดไฟล์ที่กำหนดใน Web Browser เพื่อดูการเปลี่ยนแปลงของสิ่งที่ Complie หรือสิ่งที่ทำลงไป
--------------------------------------------------------------------------------------- */
gulp.task('open', function () {
  gulp.src('index.html') // สามารถเปลี่ยนเป็นไฟล์อื่นที่เราต้องการได้
    .pipe(open());
});


/*
---------------------------------------------------------------------------------------
สุดท้ายนี้คือ task งานหลัก ที่ควบคุมการ open และ watch โดยใช้คำสั่ง task งาน open-app ตัวเดียวจบ
--------------------------------------------------------------------------------------- */
gulp.task('open-app', gulp.parallel('open', 'watch'));


// TODO ยังไม่ได้ทำ Live Reload หรือ BrowserSync
// นั่นหมายความว่าตอนนี้ต้องกด F5 หรือ Manual Refresh Web Browser เอง หากต้องการเห็นการเปลี่ยนแปลงของสิ่งที่ทำ
// มันจะ Auto open ตัว Web Browser ให้แค่ครั้งแรกครั้งเดียวเท่านั้น
// แต่ไม่มีปัญหาเรื่องของการ Compile เพราะจะ Compile ให้ทุกครั้งที่แก้ไขไฟล์ scss ในเงื่อนไขตาม task ด้านบน
