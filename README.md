# [Material Kit ในแบบของผม](https://github.com/kverawat/material-kit)

### อ่านสิ่งที่ผมทำก่อนก็ดีนะ

> หลายคนคงเจอปัญหาโดยเฉพาะมือใหม่ที่ download code [material-kit free version](https://github.com/creativetimofficial/material-kit) จากต้นฉบับจาก [creative-tim.com](https://creative-tim.com) แล้วปรากฏว่าเวลา compile sass เป็น css นั้น บางอย่างไม่เหมือนที่ต้นฉบับเค้าทำไว้ก่อนที่เราจะ compile เช่น ทศนิยมต้นฉบับมี 6 ตำแหน่ง แต่เราทำจริงได้แค่ 5 ตำแหน่ง รวมถึงการ compile แล้วไม่รองรับ Browser รุ่นเก่า ที่ประชาชนคนไทยยังใช้อยู่ เช่น IE8, IE9 และ IOS 9.5 และ Android 4, Android 5 (ว่าง ๆ ผมจะเอาสถิติเฉพาะประเทศไทยมาแบ่งปันกัน รู้แล้วจะหนาวครับ) ยังไม่รวมถึงเวลา compile แล้วมันดันทำให้แค่ 2 อย่างคือ `material-kit.css` และ `material-kit.css.map` แต่มันไม่ได้ทำการ compile ให้กับตัวไฟล์ `material-kit.min.css` ถ้าหากไม่เชื่อก่อน compile ลอง backup ต้นฉบับไว้เปรียบเทียบดูครับว่าทั้งหมดผมพูดจริง ดูจำนวนบรรทัดก็ได้ครับว่าเท่าเดิมเหมือนกับต้นฉบับไหมเวลาที่เราได้ compile มันเสร็จแล้ว

### มาดูว่าผมแก้ปัญหา compile sass นี้อย่างไร

1. ก่อนอื่น ผม forked ต้นบับจาก creativetimofficial/material-kit
2. ผมลบไฟล์ที่เราไม่ได้ใช้แน่นอนออกไปเช่น bower.json และ .github/workflows
3. แก้ไข package.json 
   - ลบบางอย่างที่ไม่ได้ใช้ออก เช่น 
      - directories
      - repository
      - keyword
      - ห้ามลบ author เพราะเป็น credit ผู้ทำ (ตามมารยาท)
   - เพิ่ม devDependencies
      - gulp-rename (ผมจะใช้ตอนทำ min.css เพราะผมจะเพิ่ม suffix คำว่า min เข้าไป)
4. แก้ไข gulpfile.js
   - เพิ่ม var rename = require('gulp-rename');
   - แก้ไข task compile-scss ให้เหมือน Bootstrap และ  creative-tim เค้า compile
      - จัดรูปแบบไฟล์ให้เหมือนต้นฉบับ ด้วยการใช้ Output แบบ expanded
        - ต้นฉบับเค้าใช้ `.pipe(sass()` ซึ่งจะให้ค่า default คือ outputStyle แบบ nested
        - แต่ผมใช้ `.pipe(sass({ outputStyle: 'expanded' })` เพราะผมอยากได้แบบดู .css ง่าย ๆ ได้มาตรฐาน มีวงเล็บปีกกาขึ้นบรรทัดใหม่แบบทั่วไปที่เข้าใช้กัน มันง่ายเวลา Dev แต่ตอน Production จริงผมค่อยเปลี่ยนไปใช้ .min.css แทน
        - ข้อมูลเพิ่มเติมเรื่อง outputStyle ของ sass ที่มีด้วยกัน 4 รูปแบบหลัก คือ `nested`, `expanded`, `compact`, `compressed` ดูได้ที่ [Sass Output Style](https://www.quackit.com/sass/tutorial/sass_output_style.cfm)
      - precision ทศนิยม 6 ตำแหน่ง
        - ต้นฉบับเค้าใช้ `.pipe(sass()` ซึ่งจะให้ค่า default คือทศนิยม 5 ตำแหน่ง
        - แต่ผมใช้ `.pipe(sass({ precision: 6 })` เพราะผมอยากได้ทศนิยม 6 ตำแหน่ง
      - autoprefix ให้รองรับ Browser รุ่นเก่า
        - เจ้าของต้นฉบับ creative-tim ปล่อย `autoprefixer()` ค่าว่าง
        - แต่เค้าแนะนำให้ใช้ `autoprefixer({browsers: ['last 2 versions']})` 
        - แต่ตัวผมเองจัดเต็มเพราะประเทศไทยไม่เหมือนที่อื่น เราใช้ Windows เถื่อนกันมาก ทำให้บางคนยังใช้ Browser รุ่นเก่า เพราะของเถื่อน update ไม่ได้ หรือบางคน update ไม่เป็น ทำให้ต้องหาวิธี Support IE รุ่นเก่า
      - autoprefix ให้ code ที่รองรับ Browser รุ่นเก่า แสดงผลออกมาแบบสวยงาม
        - เจ้าของต้นฉบับ creative-tim ปล่อย `autoprefixer()` ค่าว่าง
        - และตัวผมเองทำตามเค้า แต่ถ้าใครอยากให้มันมันเรียงตัวสวยงามก็สามารถเพิ่ม `autoprefixer({ cascade: true })` ให้กับมันได้ ดูตัวอย่างได้ที่ [cascade option in gulp-autoprefixer](https://stackoverflow.com/questions/53395252/cascade-option-in-gulp-autoprefixer) มันจะจัดวางตำแหน่งหลัง compile พวก `-moz-`, `-o-`, `-ms-`, `-webkit`- ให้มันจะเรียงตัวในแต่ละบรรทัดได้สวยงาม แต่ผู้พัฒนา Bootstrap และต้นฉบับ creative-tim เขาก็ไม่ได้ใช้วิธีนี้นะ เค้าปล่อยเรียงเส้นตรงปกติ ผมแค่บอกให้รู้ไว้เผื่อใครจะใช้ แต่ผมก็ไม่ได้ใช้ ถ้าจะใช้แนะนำว่าใช้เฉพาะ `.css` อย่าใช้กับ `.min.css` นะครับ สามารถไปแก้ที่ไฟล์ `gulpfile.js`
   - เพิ่ม task minify-scss
      - ลดขนาดไฟล์ ด้วยการใช้ Output แบบ compressed
      - เพิ่ม surffix คำว่า min ให้ไฟล์ที่ถูกลดขนาด
   - แก้ไข task watch
      - เพิ่ม minify-scss เข้าไปใน series เพราะเราอยากได้ .min.css ที่ต้องผ่านการ compile
5. ผมใช้ Visual Studio Code ผมติดตั้งด้วยการเปิด terminal หรือเปิด cmd ในตำแหน่งที่มีไฟล์ `gulpfile.js` และ `package.json` อยู่ แล้วใช้คำสั่ง
   
    ```language
    npm install
    ```

6. จากนั้นสั่ง Run gulp ของเรา ด้วยการพิมพ์คำสั่ง

    ```language
    gulp open-app
    ```

    หรือพิมพ์คำสั่ง

    ```language
    npm run open-app
    ```

7. สิ่งที่ได้คือ มันจะเปิดไฟล์ `index.html` ขึ้นมาให้เราชม อาจจะเปิดใน Chrome, Firefox, Edge ของผมเปิดใน Chrome (ที่มันเปิดเองอัตโนมัติ เพราะเราได้เขียน code กำหนดให้มันเปิด ดูที่ไฟล์ `gulpfile.js`)

8. ขั้นตอนต่อไปนี้สำคัญมาก คือการแก้ไขไฟล์ scss หรือ sass เพื่อดูว่ามันจะ compile ให้เราได้จริงตามที่เราต้องการไหม เราจะทดลองแก้ไขสีหลักของเรา (primary color) มันอยู่ที่ `assets/scss/material-kit/variables/_brand.scss` ที่บรรทัด `$primary: $purple-500 !default;` ให้เราลองเปลี่ยจาก `$purple-500` เป็น `$yellow-500` ดู (จริง ๆ ผมแนะนำว่าลองใส่เป็นสีจริงที่เราจะค้นหาได้ง่าย ๆ ตอนอยากทดสอบ view code แล้ว ค้นหาโดยใส่ชื่อสี ว่ามันเปลี่ยนจริงไหม เช่น `#123456` แบบนี้ สรุปก็คือแสดงว่าตอนนี้สิ่งที่เราแก้ไปคือ `$primary: #123456 !default;` จากนั้นให้กด save ไฟล์

9. เมื่อกด save ในขั้นตอนก่อนหน้านี้ มันก็จะ complie ให้เราเสร็จเรียบร้อย กด F5 หรือ Refresh หน้าจอของ ไฟล์ `index.html` ใน Browser ของเราดูว่าสี primary ของเราเปลี่ยนเป็นสีที่เราเปลี่ยนจริง ๆ เมื่อมัน compile ให้เราเสร็จเราจะได้มาทั้ง `material-kit.css`, `material-kit.css.map`, `material-kit.min.css` อยู่ใน folder ชื่อ `assets/css` ลองแอบเข้าไปในไฟล์ทั้ง 3 นี้ แล้วค้นหา `#123456` จะพบว่าค้นหาเจอจริง ๆ เพราะเรา compile เรียบร้อย (ถ้าใช้ไฟล์ `gulpfile.js` จากต้นฉบับ จะพบว่ามันจะไม่ compile ไฟล์ material-kit.min.css ให้เรา และจะเจอปัญหาเรื่องจำนวนทศนิยมที่มีแค่ 5 หลัก และจะเจอปัญหามันไม่เอา prefix บางอย่างที่จำเป็นต้องใช้ใน ฺBrowser รุ่นเก่ามาให้เรา เช่นพวก `-moz-`, `-o-`, `-ms-`, `-webkit`- มันจะไม่ทำให้เราตอน compile ด้วย code ต้นฉบับ ซึ่งผมคิดว่ามันจำเป็นถ้าเราจะให้รองรับ Web Browser เก่า ๆ ผมก็เลยจัดให้แล้วในสิ่งที่ผมแก้ gulpfile.js ในรูปแบบของผม

10. เมื่อ compile แล้ว ได้ผลเป็นที่พอใจและขี้เกียจทำต่อ (จะเลิกทำแล้ว) ให้กด `ctrl+c` ใน terminal หรือใน cmd ของเรา เพื่อจบการทำงานทั้งหมด

11. ผมเพิ่มไฟล์ `.editorconfig` จะได้เป็นมาตรฐานเวลาเขียน code ของตัวผมเอง ถ้าใครเห็นต่างหรือใช้ไม่เหมือนผมก็อย่าใช้ครับ มันไม่มีผลใด ๆ ต่อการ compile scss มันเอาไว้เป็นมาตรฐาน code ตอนแสดงผลและเขียนเท่านั้น อยากรู้เพิ่มเติม ค้นหา `editorconfig` ใน google ดูครับ หรือไปที่ของจริงเลยที่ [editorconfig.org](https://editorconfig.org)

### สิ่งที่ผมแก้ไขเพิ่มเติม

1. ปัญหาของ link color หรือสี link ที่แก้ไขไม่ได้ ไม่น่าเชื่อว่าเกิดขึ้นจริง ผมแก้ปัญหานี้ให้แล้วตามนี้ครับ [$link-color could not be customized.](https://github.com/creativetimofficial/material-kit/issues/140) คือ ให้เปิดไฟล์ assets\scss\material-kit\variables\_bootstrap-material-design.scss แล้วให้เพิ่ม !default ที่ $link-color (บรรทัดที่ 130) แค่นั้นเองจบ ทีนี้ถ้าเราอยากแก้ link color ให้เราไปแก้ในไฟล์ assets\scss\material-kit\bootstrap\scss\_variables.scss ที่ $link-color (บรรทัดที่ 150) เช่นผมจะลองเปลี่ยนจากเดิม $link-color: theme-color("primary") !default; เป็น $link-color: theme-color("warning") !default; ผลที่ได้คือ OK ครับ แก้สี link ได้แล้ว (ในไฟล์ที่ผม Forked มา ผมแก้แค่ `_bootstrap-material-design.scss` เท่านั้นนะครับ ส่วน `_variables.scss` ผมแค่ทดลองให้ดูเฉย ๆ ว่าทำแล้วได้ผลจริง
2. ปัญหาของ variable อื่น ๆ ที่พยายามจะแก้ไขแล้วทำไมมันไม่ได้เปลี่ยนตามที่เราแก้ ดูที่นี่ครับ [Missing !default in variables](https://github.com/creativetimofficial/ct-material-kit-pro/issues/101) **บอกใบ้ให้นิดนึง คือต้องใส่ !default เข้าไปครับ ถึงจะแก้แล้วเห็นผล ต้นฉบับที่ผม Forhed มานั้น บางตัวก็ไม่ได้ใส่ !default ครับ**

### สิ่งที่ผมอยากจะบอก

1. เราจะยกเลิก Nav Bar Fix Top ได้ยังไง ดูได้ที่ [impossible to remove fixed-top](https://github.com/creativetimofficial/material-kit/issues/158)
2. เราจะเปลี่ยน Sidebar ด้านข้างจากปกติด้านขวาให้อยู่ด้านซ้าย จะแก้ปัญหาดูได้ที่ [How to move Sidebar on Small screen from Right side to Left Side?](https://github.com/creativetimofficial/material-kit/issues/118) ข่าวดี ! ในเวอร์ชั่นล่าสุดที่เราใช้ตอนนี้นั้น ผู้พัฒนาได้เพิ่ม class นี้ให้เราเรียบร้อยแล้วครับ ดีใจด้วย เอาไปใช้ได้เลย
3. เราจะไม่ใช้ gulp แต่จะใช้ webpack เพื่อ compile เพราะเป็นคนชอบของใหม่เบื่อของเก่า เบื่อวิธีเดิม ๆ ทั้ง ๆ ที่มันก็ยังใช้ได้ดี แต่ปัญหาคือทำไม่สำเร็จ จะแก้ปัญหาชอบของใหม่นี้ได้ยังไง ดูได้ที่ [Running material-kit with webpack 4](https://github.com/creativetimofficial/material-kit/issues/137)
4. เราจะแก้ปัญหาหน้า login เวลาดูด้วยมือถือแล้วไม่สวย ไม่ได้เรื่อง ตำแหน่งบางอย่างผิดพลาด จะแก้ปัญหาได้ยังไง ดูได้ที่ [Login page doesn't work on some of the smaller screens](https://github.com/creativetimofficial/material-kit/issues/138)
5. เราจะเพิ่ม Image Logo ที่ Nav Bar ได้ยังไง ดูได้ที่ [Add image logo to navbar](https://github.com/creativetimofficial/material-kit/issues/107)
6. เราจะเปลี่ยนจาก click link ที่เมนู Navbar แล้วแสดง dropdown เป็นการ hover วางเมาส์เหนือ link ที่ Navbar แล้วแสดง dropdown ได้ยังไง ดูได้ที่ [clickable navbar with hover](https://github.com/creativetimofficial/material-kit/issues/98) และตัวอย่างที่อยากให้ดูมากห้าพลาด ของจริง ทำได้จริง [bootstrap dropdown hover menu](https://codepen.io/bsngr/pen/frDqh) เยี่ยมมาก
7. เราจะแก้ปัญหาแบบฟอร์มที่ต้องกรอกข้อความใน iphone เมื่อมันกดป้อนข้อมูลแล้วแต่มันดันแสดงขึ้นมาผิดตำแหน่งได้ยังไง **น่าสนใจมาก เจอปัญหานี้ทุกคนแน่** ดูได้ที่ [iPhone input binding cursor](https://github.com/creativetimofficial/ct-material-kit-pro/issues/112)
8. เราจะแก้ปัญหาตัวอักษร h1 ใน Title ใต้ Navbar ที่มันใหญ่เกินไปเวลาที่แสดงในมือถือได้อย่างไร โดยเฉพาะใน ipad iphone เจอกันแน่ ดูได้ที่ [Header 1 looks strange in Safari on iPhone](https://github.com/creativetimofficial/ct-material-kit-pro/issues/111)
9. เราจะซ่อน Mobile Menu ที่เราเปิดยังไงหลังจาก click link ที่อยู่ภายในเมนูที่เราเปิดขึ้นมานั้น มันคือปัญหาของคนทำ landing page หนือเว็บที่มีหน้าเดียวแต่อยากให้กด link ในเมนูแล้วกระโดไปตำแหน่ง anchor ในหน้านั้น แต่ Mobile Menu มันดันเปิดค้างไม่ยอมปิดให้ เราจะแก้ปัญหายังไง ดูได้ที่ [hide mobile menu after click on menu](https://github.com/creativetimofficial/ct-material-kit-pro/issues/155) และให้ลองดูที่ [dropdown-menu with anchors on mobile doesn't hide](https://github.com/creativetimofficial/material-kit/issues/60) ปกติปัญหานี้จะไม่เกิดกับคนที่ทำเว็บหลายหน้าเพราะ click link แล้วหน้ามันเปลี่ยน เลยไม่เจอปัญหานี้กัน
10. เราจะกลับไปใช้ Navbar แบบเดิม ๆ เหมือน Bootstrap ยังไง เพราะเราไม่ชอบแบบที่อยู่ด้านข้าง อยากได้แบบทิ้งดิ่งลงมา ดูได้ที่ [Using the default behaviour for navbar on responsive](https://github.com/creativetimofficial/ct-material-kit-pro/issues/125) และถ้าประเภท One Page ที่ใช้ link แบบ anchor ถ้าอยากให้มัน Hide เมื่อ click link ด้านใน ให้ดูที่ [dropdown-menu with anchors on mobile doesn't hide](https://github.com/creativetimofficial/material-kit/issues/60)
11. เราจะทำ Carousel แบบ fade ได้ยังไง ดูได้ที่ [carousel-fade](https://github.com/creativetimofficial/ct-material-kit-pro/issues/159)
12. เราจะแก้ปัญหารูปภาพของเรามันล้นกรอบ หลุดออกจากกรอบของ card เพราะรูปเราอาจสูงเกินไปได้ยังไง ดูได้ที่ [Profile Card Example does not work correctly](https://github.com/creativetimofficial/ct-material-kit-pro/issues/167)
13. เราจะแก้ปัญหาเรื่องความปลอดภัยยังไง มีคนบอกว่า Bootstrap แกนหลักของ Material Kit เป็น version ที่มีปัญหา Security จริงหรือเปล่า ดูได้ที่ [Includes front-end JavaScript Libraries with known security vulnerabilities](https://github.com/creativetimofficial/ct-material-kit-pro/issues/140) ผมสรุปให้เลยนะอันนี้ว่าไม่มีปัญหาแล้ว เพราะทั้ง Material Kit ตัวฟรี และ Material Kit PRO ตัวเสียตัง ใช้ jQuery version 3.2.1
14. เราจะแก้ปัญหารูปภาพและข้อมูลที่อยู่ในส่วนของ main-raised พวกเนื้อหาหลักทั้งหมด คือตำแหน่งที่อยู่ใต้ page-header มันแสดงไม่ถูกต้องเหมือนหน้าตัวอย่างต้นฉบับได้ยังไง ดูได้ที่ [Wrong width on example page "product page"](https://github.com/creativetimofficial/ct-material-kit-pro/issues/133) **ปัญหานี้จะไม่เกิดถ้าเราไม่ใส่อะไรผิดธรรมชาติ หรือผิดโครงสร้างหลักของ code ต้นฉบับ แต่ปัญหานี้จะแก้ง่ายมากถ้าเรามีความรู้เรื่องการจัดการหน้าให้สวยงามด้วยพื้นฐาน css ที่ดีพอระดับหนึ่งครับ ดูตาม link ที่ให้ไปแล้วกัน**
15. เราจะปรับความเร็วของ Carousel ได้ยังไง ดูได้ที่ [Carousel don't recognize the data-interval attribute](https://github.com/creativetimofficial/material-kit/issues/104)
16. เราจะเอา filter ที่ทำให้รูปของเราสีไม่เหมือนรูปจริงที่เรามีออกไปได้ยังไง "รูปภาพตำแหน่งที่อยู่ใน page-header" ดูได้ที่ [https://github.com/creativetimofficial/material-kit/issues/83](https://github.com/creativetimofficial/material-kit/issues/83)
17. เราจะทำให้เมนูของเราตอนที่อยู่ใน PC Desktop หรืออยู่ใน Tablet มีหน้าตาเหมือนตอนอยู่ใน Mobile ที่เป็น แฮมเบอร์เกอร์ ได้ยังไง ดูได้ที่ [Menu mobile on all media screens](https://github.com/creativetimofficial/material-kit/issues/78)
18. เราจะแก้ปัญหา Select มีความสูงหรือจะเรียกว่าระยะแนวนอนที่ไม่ตรงแนวกับเพื่อน ๆ ของมันในแนวเดียวกันได้ยังไง มองตาเปล่าก็เห็นว่าเพี้ยน หน้าตามันเพี้ยนยังไง และจะแก้ปัญหานี้ยังไง ดูได้ที่ [Select Box height is not aligning](https://github.com/creativetimofficial/material-kit/issues/187) **ผมคิดว่าสำคัญ ควรแก้นะ ล่าสุดตัวฟรี ver 2.0.7 ที่ผม Forked มา ก็ยังไม่ได้แก้ ว่าง ๆ ผมจะแก้ตาม link ที่ผมให้ไว้ ถ้าผมแก้แล้วจะ update บอกอีกที**
19 เราจะยกเลิกการแสดงวันที่ก่อนวันปัจจุบันใน datetimepicker ได้ยังไง ดูได้ที่ [Please give me a clear code to disable previous dates in datetimepicker in Material Kit](https://github.com/creativetimofficial/material-kit/issues/149) บางคนไม่ต้องการให้เลือกวันก่อนปัจจุบัน เช่น ระบบจองห้องพัก เป็นต้น แต่ถ้าพวกใช้ datetimepicker ทั่ว ๆ ไป ก็ไม่ต้องสนใจครับ
20. เราจะแก้ปัญหา modal ปิดไม่ได้ได้ยังไง (บางคนอาจเจอปัญหานี้ บางคนอาตไม่เจอ) ดูได้ที่ [Cannot close modal](https://github.com/creativetimofficial/material-kit/issues/142)
21. เราจะเปิดใช้งานปุ่มกดให้มี ripple effect หรือให้ card ต่าง ๆ มี ripple effect ได้ยังไง ดูได้ที่ [Cannot implement ripple effect other than buttons](https://github.com/creativetimofficial/material-kit/issues/141) **ล่าสุดตัวฟรี ver 2.0.7 ที่ผม Forked มา มันมีมาให้เลยนะ เราไม่ต้องทำอะไรทั้งนั้น**
22. เราจะใช้ input label ใน form ยังไง ดูได้ที่ [Using input labels in a form](https://demos.creative-tim.com/material-kit/docs/2.1/getting-started/build-tools.html)

### ปัญหาทุกอย่างแก้ไขได้
ปัญหาอีกมากมายที่คุณเจออยู่หรืออาจเจอในอนาคต ไม่ต้องห่วงครับ เกือบทุกอย่างมีคำตอบให้คุณแล้ว ดูได้ที่ผู้จัดทำเลยครับ [Issue ทั้ง Open และ Closed แล้ว](https://github.com/creativetimofficial/material-kit/issues)

สำหรับคนที่สนับสนุนผู้ผลิตที่ได้สั่งซื้อแบบ PRO version แล้วติดปัญหา ให้ดูได้ที่นี่ครับ [Issue ทั้ง Open และ Closed แล้ว สำหรับ Material Kit PRO version](https://github.com/creativetimofficial/ct-material-kit-pro/issues)

----------

## เปรียบเทียบข้อแตกต่างระหว่างตัวฟรีกับตัวจ่ายตัง

ในเอกสาร Document บอกว่าตัว PRO จะมีบางอย่างที่ตัวฟรีไม่มี จากการทดสอบดู พบว่าจริงครับ แต่ไม่จริงทั้งหมด เพราะบางอย่างที่บอกว่าต้องเป็น PRO ถึงจะใช้ได้ แต่เรากลับพบว่าแบบฟรีก็ใช้ได้เหมือนกัน เช่น Breadcrumb, Info Areas, Pagination, Parallax, Popovers, Video ที่บอกว่าเป็น PRO แต่เอาเข้าจริงฟรีก็ใช้ได้ ลองเอา code ไปวางดู ได้เฉยเลย แต่บางตัวบอกว่า PRO ก็ต้อง PRO เท่านั้นก็มีจริง ๆ เช่น Collapse, Tooltips, FileUpload Jasny, jQuery Tagsinput, Select Bootstrap

### Components 

| #  | Material Kit (2.0.7) | Material Kit PRO (2.2.0) |
|-------------------|:---:|:----:|
| Alert             |  ✔️  |  ✔️  |
| Badge             |  ✔️  |  ✔️  |
| Breadcrumb        |  ✔️  |  ✔️  |
| Button            |  ✔️  |  ✔️  |
| Card              |  ✔️  |  ✔️  |
| Carouse           |  ✔️  |  ✔️  |
| Collapse          |  -  |  ✔️  |
| Dropdowns         |  ✔️  |  ✔️  |
| Forms             |  ✔️  |  ✔️  |
| Google Maps       |  ✔️  |  ✔️  |
| Info Areas        |  ✔️  |  ✔️  |
| Material Icons    |  ✔️  |  ✔️  |
| Modal             |  ✔️  |  ✔️  |
| Navs              |  ✔️  |  ✔️  |
| Navbar            |  ✔️  |  ✔️  |
| Pagination        |  ✔️  |  ✔️  |
| Parallax          |  ✔️  |  ✔️  |
| Popovers          |  ✔️  |  ✔️  |
| Progress          |  ✔️  |  ✔️  |
| Tables            |  ✔️  |  ✔️  |
| Tooltips          |  -  |  ✔️  |
| Typography        |  ✔️  |  ✔️  |
| Video             |  ✔️  |  ✔️  |

### Plugins

| #  | Material Kit (2.0.7) | Material Kit PRO (2.2.0) |
|-------------|:---:|:----:|
| Bootstrap Switch           |  ✔️  |  ✔️  |
| DateTimePicker             |  -  |  ✔️  |
| FileUpload Jasny           |  -  |  ✔️  |
| jQuery Tagsinput           |  -  |  ✔️  |
| Select Bootstrap           |  -  |  ✔️  |
| Sliders                    |  ✔️  |  ✔️  |

### Features

| #  | Material Kit (2.0.7) | Material Kit PRO (2.2.0) |
|-------------|:---:|:----:|
| Input Labels            |  ✔️  |  ✔️  |
| Default Navbar          |  -  |  ✔️  |
| Navbar Logo             |  ✔️  |  ✔️  |
| Binding Cursor          |  ✔️  |  ✔️  |


----------


# สรุป
1. ของเค้าดีจริง ทั้งตัวฟรี และตัว PRO ที่ต้องเสียตังซื้อ ผมให้คะแนน 9.9/10
2. สวยงาม ได้มาตรฐาน ต่อยอดได้ง่าย รองรับ Browser เก่า ๆ ที่พี่ไทยยังใช้กันอยู่ด้วย
3. Material Kit Pro ใน Version ที่ต้องเสียเงินซื้อมันคุ้มค่าแน่นอน เพราะผู้พัฒนา Bootstrap ได้ Verrify Code เค้าแล้วว่ามีคุณภาพจริง (Themes built by or reviewed by Bootstrap's creators.) ยกระดับให้เป็น Theme เพื่อให้ขาย Theme ในเว็บของ Bootstrap ได้เลย (best Bootstrap creators in the world.) ถ้าไม่เชื่อไปดูได้ที่ [Bootstrap Theme](https://themes.getbootstrap.com/)
4. ผมไม่มีส่วนได้เสียกับผู้พัฒนา Material Kit ผมไม่ได้ Commission ใด ๆ ในตอนนี้ แต่อนาคตไม่แน่เค้าอาจแบ่งตังให้ผมค่าเชียร์
5. สำหรับ Material Kit ตัวฟรี ที่ผมนำเสนอตอนนี้ เป็น license แบบ MIT ครับ สามารถเอาไปใช้ได้ฟรี จะทำเว็บขายของ จะทำการกุศล จะเอาไปรับจ้างเขียนเว็บ จะเอา code ไปแก้ก็ได้ แต่ห้ามลบ Credit ที่เค้าเขียนใน code ของเค้าออกนะ ปกติจะอยู่ในส่วนบรรทัดบน ๆ ของไฟล์ที่เขาเขียนไว้ เช่นใน material-kit.css, material-kit.js และใน core ของเขา และห้ามเอา code ทั้งดุ้นที่เขาแจกฟรีไปขายต่อ
6. สำหรับ Material Kit PRO ตัวเสียตัง มีหลายแบบหลายราคาครับ ถ้าสนใจ ดูได้ที่นี่ [material-kit-pro](https://www.creative-tim.com/product/material-kit-pro)


# ก่อนจากกัน (ถ้ามีเวลา)
แนะนำให้ลองดู Material Kit Free Version ในแบบฉบับของท่าน Lumenion ผมว่าเขาก็แก้ไปเยอะ เขาตาม update พวก issue อยู่ประจำ และทำได้ดีนะครับ ลองดู [Github.com/Lumrenion/material-kit](https://github.com/Lumrenion/material-kit) **ผมว่าเค้าคือเก่งมาก** เค้า Update bootstrap to Version 4.4.1 ด้วย

----------

# README ต้นฉบับของจริงด้านล่างนี้ครับ

# [Material Kit](https://demos.creative-tim.com/material-kit/index.html) [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social&logo=twitter)](https://twitter.com/home?status=Material%20Kit%20is%20a%20Free%20Bootstrap%204%20UI%20Kit%20%E2%9D%A4%EF%B8%8F%0Ahttps%3A//demos.creative-tim.com/material-kit/index.html%20%23bootstrap%20%23material%20%23design%20%23uikit%20%23freebie%20%20via%20%40CreativeTim)


 ![version](https://img.shields.io/badge/version-2.0.7-blue.svg)  ![license](https://img.shields.io/badge/license-MIT-blue.svg) [![GitHub issues open](https://img.shields.io/github/issues/creativetimofficial/material-kit.svg?maxAge=2592000)](https://github.com/creativetimofficial/material-kit/issues?q=is%3Aopen+is%3Aissue) [![GitHub issues closed](https://img.shields.io/github/issues-closed-raw/creativetimofficial/material-kit.svg?maxAge=2592000)](https://github.com/creativetimofficial/material-kit/issues?q=is%3Aissue+is%3Aclosed) [![Join the chat at https://gitter.im/NIT-dgp/General](https://badges.gitter.im/NIT-dgp/General.svg)](https://gitter.im/creative-tim-general/Lobby) [![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg)](https://discord.gg/E4aHAQy)


![Product Gif](https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-kit/material-kit.gif)

**Material Kit** is a **Free Bootstrap 4 UI Kit** with a fresh, new design inspired by Google's material design. You asked for it, so we built it. It's a great pleasure to introduce to you the material concepts in an easy to use and beautiful set of components. Along with the restyling of the Bootstrap elements, you will find three fully-coded example pages, to help you design your next project.

**Material Kit** makes use of light, surface, and movement. It uses a deliberate color choice, edge-to-edge imagery, and large scale typography. The general layout resembles sheets of paper following multiple different layers so that the depth and order are obvious. The navigation stays mainly on the left and the actions on the right.

This new design has elements that have been the result of research regarding ink and paper and the way objects and materials interact in real life. The result is a beautiful and consistent set of elements that can get you started with your next project. Material Kit is a great tool if you are looking to create a web presence for your Android application and need to be consistent, leaving the impression of visually similar elements. It is also a great resource in its own right, looking gorgeous and helping you build your web pages.

**Material Kit** is based on the Github Repo from Fezvrasta who did an amazing job creating the backbone for the material effects, animations, and transitions. Big thanks to his team for their forward-thinking efforts.


## Table of Contents

* [Versions](#versions)
* [Demo](#demo)
* [Quick Start](#quick-start)
* [Documentation](#documentation)
* [File Structure](#file-structure)
* [Browser Support](#browser-support)
* [Resources](#resources)
* [Reporting Issues](#reporting-issues)
* [Upgrade to Pro Version](#upgrade-to-pro-version)
* [Licensing](#licensing)
* [Useful Links](#useful-links)


## Versions

[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/html-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/material-kit)[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/vue-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/vue-material-kit)[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/react-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/material-kit-react)[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/react-native-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/material-kit-react-native)[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/figma-logo.jpg?raw=true" width="60" height="60" />](https://demos.creative-tim.com/material-kit-figma/presentation.html)[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/wordpress-logo.jpg?raw=true" width="60" height="60" />](https://themeisle.com/themes/hestia/?ref=creativetim)[<img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/photoshop-logo.jpg" width="60" height="60" />](https://github.com/creativetimofficial/material-kit/tree/photoshop)[<img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/sketch-logo.jpg" width="60" height="60" />](https://github.com/creativetimofficial/material-kit/tree/sketch)






| HTML | React | Vue  |
| --- | --- | ---  |
| [![Material Kit  HTML](https://github.com/creativetimofficial/public-assets/blob/master/material-kit/material-kit.jpeg?raw=true)](https://www.creative-tim.com/product/material-kit)  | [![Material Kit  React](https://github.com/creativetimofficial/public-assets/blob/master/material-kit-react/material-kit-react.jpeg?raw=true)](https://www.creative-tim.com/product/material-kit-react)  | [![Vue Material Kit](https://github.com/creativetimofficial/public-assets/blob/master/vue-material-kit/vue-material-kit.jpeg?raw=true)](https://www.creative-tim.com/product/vue-material-kit)

| React Native | Figma | WordPress |
| ---  | --- | --- |
| [![Material Kit React Native](https://github.com/creativetimofficial/public-assets/blob/master/material-kit-react-native/opt_mkrn_thumbnail.jpg?raw=true)](https://www.creative-tim.com/product/material-kit-react-native) | [![Material Kit Figma](https://github.com/creativetimofficial/public-assets/blob/master/material-kit-figma/material-kit-figma.jpg?raw=true)](https://demos.creative-tim.com/material-kit-figma/presentation.html) | [![Material Kit WordPress](https://github.com/creativetimofficial/public-assets/blob/master/material-kit-wordpress/opt_smd_thumbnail.jpg?raw=true)](https://themeisle.com/themes/hestia/?ref=creativetim)

## Demo

| Buttons | Inputs | Navbars  |
| --- | --- | ---  |
| [![Buttons](https://github.com/creativetimofficial/public-assets/blob/master/material-kit/buttons.png?raw=true)](https://demos.creative-tim.com/material-kit/index.html#buttons)  | [![Inputs](https://github.com/creativetimofficial/public-assets/blob/master/material-kit/inputs.png?raw=true)](https://demos.creative-tim.com/material-kit/index.html#inputs)  | [![Navbar](https://github.com/creativetimofficial/public-assets/blob/master/material-kit/navbar-section.png?raw=true)](https://demos.creative-tim.com/material-kit/index.html#navigation)

| Login Page | Landing Page | Profile Page  |
| --- | --- | ---  |
| [![Login Page](https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-kit/login-page.png)](https://demos.creative-tim.com/material-kit/index.html#carousel)  | [![Landing Page](https://github.com/creativetimofficial/public-assets/blob/master/material-kit/landing-page.png?raw=true)](https://demos.creative-tim.com/material-kit/examples/landing-page.html)  | [![Profile Page](https://github.com/creativetimofficial/public-assets/blob/master/material-kit/profile-page.png?raw=true)](https://demos.creative-tim.com/material-kit/examples/profile-page.html)

[View More](https://demos.creative-tim.com/material-kit/index.html)


## Quick start

- `npm i material-kit`
- [Download from Github](https://github.com/creativetimofficial/material-kit/archive/master.zip).
- [Download from Creative Tim](https://www.creative-tim.com/product/material-kit).
- Install with [Bower](https://bower.io/): ```bower install material-kit```.
- Clone the repo: `git clone https://github.com/creativetimofficial/material-kit.git`.


## Documentation
The documentation for the Material Kit is hosted at our [website](https://demos.creative-tim.com/material-kit/docs/2.1/getting-started/introduction.html).


## File Structure
Within the download you'll find the following directories and files:

```
material-kit/
├── CHANGELOG.md
├── LICENSE.md
├── README.md
├── assets
│   ├── assets-for-demo
│   ├── css
│   │   ├── material-kit.css
│   │   ├── material-kit.css.map
│   │   └── material-kit.min.css
│   ├── img
│   ├── js
│   │   ├── bootstrap-material-design.js
│   │   ├── bootstrap-material-design.min.js
│   │   ├── core
│   │   │   ├── jquery.min.js
│   │   │   └── popper.min.js
│   │   ├── material-kit.js
│   │   ├── material-kit.min.js
│   │   └── plugins
│   │       ├── bootstrap-datetimepicker.min.js
│   │       ├── jasny-bootstrap.min.js
│   │       ├── moment.min.js
│   │       └── nouislider.min.js
│   └── scss
│       ├── bootstrap
│       ├── core
│       ├── material-kit.scss
│       └── plugins
├── bower.json
├── docs
│   └── documentation.html
├── examples
│   ├── landing-page.html
│   ├── profile-page.html
│   └── signup-page.html
└── index.html
```


## Browser Support

At present, we officially aim to support the last two versions of the following browsers:

<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/chrome-logo.png?raw=true" width="64" height="64"> <img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/firefox-logo.png" width="64" height="64"> <img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/edge-logo.png" width="64" height="64"> <img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/safari-logo.png" width="64" height="64"> <img src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/opera-logo.png" width="64" height="64">



## Resources
- Demo: <https://demos.creative-tim.com/material-kit/index.html>
- Download Page: <https://www.creative-tim.com/product/material-kit>
- Documentation: <https://demos.creative-tim.com/material-kit/docs/2.1/getting-started/introduction.html>
- License Agreement: <https://www.creative-tim.com/license>
- Support: <https://www.creative-tim.com/contact-us>
- Issues: [Github Issues Page](https://github.com/creativetimofficial/material-kit/issues)
- **Dashboards:**

| HTML | React | Vue  | Angular |
| --- | --- | ---  | ---  |
| [![Material Dashboard  HTML](https://github.com/creativetimofficial/public-assets/blob/master/material-dashboard-html/material-dashboard.jpeg?raw=true)](https://www.creative-tim.com/product/material-dashboard) | [![Material Dashboard  React](https://github.com/creativetimofficial/public-assets/blob/master/material-dashboard-react/material-dashboard-react.jpeg?raw=true)](https://www.creative-tim.com/product/material-dashboard-react) | [![Vue Material Dashboard](https://github.com/creativetimofficial/public-assets/blob/master/vue-material-dashboard/vue-material-dashboard.jpeg?raw=true)](https://www.creative-tim.com/product/vue-material-dashboard)  | [![ Material Dashboard Angular](https://github.com/creativetimofficial/public-assets/blob/master/material-dashboard-angular/material-dashboard-angular.jpg?raw=true)](https://www.creative-tim.com/product/material-dashboard-angular2)

| HTML Dark | Vuetify  |
| --- | --- |
| [![Material Dashboard Dark](https://github.com/creativetimofficial/public-assets/blob/master/material-dashboard-dark/material-dashboard-dark.jpg?raw=true)](https://www.creative-tim.com/product/material-dashboard-dark) | [![Material Dashboard Vuetify](https://github.com/creativetimofficial/public-assets/blob/master/material-dashboard-vuetify/material-dashboard-vuetify.jpg?raw=true)](https://www.creative-tim.com/product/vuetify-material-dashboard)

## Reporting Issues

We use GitHub Issues as the official bug tracker for the Material Kit. Here are some advices for our users that want to report an issue:

1. Make sure that you are using the latest version of the Material Kit. Check the CHANGELOG from your dashboard on our [website](https://www.creative-tim.com/?ref=mk-github-readme).
2. Providing us reproducible steps for the issue will shorten the time it takes for it to be fixed.
3. Some issues may be browser specific, so specifying in what browser you encountered the issue might help.

## Upgrade to PRO Version

Are you looking for more components? Please check our Premium Version of Material Kit right [here](https://www.creative-tim.com/product/material-kit-pro).

## Licensing

- Copyright 2020 Creative Tim (https://www.creative-tim.com/?ref=mk-github-readme)

- Licensed under MIT (https://github.com/creativetimofficial/material-kit/blob/master/LICENSE.md)

## Useful Links

- [Tutorials](https://www.youtube.com/channel/UCVyTG4sCw-rOvB9oHkzZD1w)
- [Affiliate Program](https://www.creative-tim.com/affiliates/new?ref=mk-github-readme) (earn money)
- [Blog Creative Tim](http://blog.creative-tim.com/)
- [Free Products](https://www.creative-tim.com/bootstrap-themes/free?ref=mk-github-readme) from Creative Tim
- [Premium Products](https://www.creative-tim.com/bootstrap-themes/premium?ref=mk-github-readme) from Creative Tim
- [React Products](https://www.creative-tim.com/bootstrap-themes/react-themes?ref=mk-github-readme) from Creative Tim
- [Angular Products](https://www.creative-tim.com/bootstrap-themes/angular-themes?ref=mk-github-readme) from Creative Tim
- [VueJS Products](https://www.creative-tim.com/bootstrap-themes/vuejs-themes?ref=mk-github-readme) from Creative Tim
- [More products](https://www.creative-tim.com/bootstrap-themes?ref=mk-github-readme) from Creative Tim
- Check our Bundles [here](https://www.creative-tim.com/bundles?ref=mk-github-readme)

### Social Media

Twitter: <https://twitter.com/CreativeTim>

Facebook: <https://www.facebook.com/CreativeTim>

Dribbble: <https://dribbble.com/creativetim>

Instagram: <https://www.instagram.com/CreativeTimOfficial>
