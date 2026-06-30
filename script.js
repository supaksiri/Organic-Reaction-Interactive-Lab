/* =========================================================
   Organic Reaction Interactive Lab
   ห้องทดลองอินเทอร์แอคทีฟ: ปฏิกิริยาเคมีของสารอินทรีย์
   ---------------------------------------------------------
   ไฟล์: script.js
   ส่วนนี้ (เฟส 1) ประกอบด้วย:
     1) renderFormula()      -> แปลงสูตรเคมีให้มีตัวห้อยอัตโนมัติ
     2) reactionDatabase     -> ฐานข้อมูลปฏิกิริยา 20 รายการ
     3) ฟังก์ชันค้นหาในฐานข้อมูล (helper) ที่หน้าอื่น ๆ จะเรียกใช้ต่อ
   ส่วนอื่น (ห้องทดลอง, ตาราง, ภารกิจ, รายงาน ฯลฯ) จะเพิ่มในเฟสถัดไป
   ========================================================= */

/* ---------------------------------------------------------
   1) renderFormula(formula)
   ---------------------------------------------------------
   รับสตริงสูตรเคมีที่เขียนตัวเลขติดกับตัวอักษรปกติ เช่น "CH4"
   แล้วคืนค่าเป็น HTML ที่มี <sub> ครอบตัวเลขที่เป็นจำนวนอะตอม
   รองรับ:
     - เลขห้อยหลังธาตุ/วงเล็บ เช่น CH4 -> CH<sub>4</sub>
     - ประจุไอออน เช่น SO4^2- หรือ SO4(2-) -> แสดงเป็น superscript
     - สัญลักษณ์ลูกศรปฏิกิริยา -> แปลงเป็น → หรือ ⇌ ให้อัตโนมัติ
     - เครื่องหมายบวกคงรูปแบบเดิม
   หมายเหตุ: ฟังก์ชันนี้คืนค่าเป็น "HTML string" ผู้เรียกต้องนำไปใส่ผ่าน
   innerHTML (ไม่ใช่ textContent) จึงจะเห็นตัวห้อยจริง
   --------------------------------------------------------- */
function renderFormula(formula) {
  if (!formula) return "";

  let result = String(formula);

  // แปลงลูกศรปฏิกิริยาแบบพิมพ์ง่าย ให้เป็นสัญลักษณ์ที่ถูกต้อง
  result = result
    .replace(/<=>|<->/g, "⇌")
    .replace(/->|=>/g, "→");

  // แปลงประจุไอออนรูปแบบ X^2- หรือ X^2+ ให้เป็น superscript
  result = result.replace(/\^(\d*[+-])/g, '<sup>$1</sup>');

  // แปลงตัวเลขที่ตามหลังตัวอักษร/วงเล็บปิด/วงเล็บเหลี่ยมปิด ให้เป็น subscript
  // ตัวอย่างที่ครอบคลุม: CH4 , Cr2O7 , (NH4)2SO4 , H2O , KMnO4
  result = result.replace(/([A-Za-z\)\]])(\d+)/g, '$1<sub>$2</sub>');

  return result;
}

/* ใช้สำหรับแทรกสูตรเคมีลงใน element โดยตรง (ทางลัด ลดโค้ดซ้ำในหน้าอื่น) */
function setFormulaHTML(element, formula) {
  if (!element) return;
  element.innerHTML = renderFormula(formula);
}

/* ---------------------------------------------------------
   2) reactionDatabase
   ---------------------------------------------------------
   แต่ละรายการมีโครงสร้างตามที่กำหนดในสเปก:
   id, reactionType, reactant, reagent, condition,
   equation, wordEquation, product, observation,
   explanation, colorChange, animationType,
   worksheetQuestion, hint, commonMistake

   หมวดหมู่ reactionType ที่ใช้ (ให้ตรงกับเมนูแผงควบคุม):
   "การแทนที่" | "การเติม" | "การเผาไหม้" |
   "ออกซิเดชัน" | "เอสเทอริฟิเคชัน" | "ไฮโดรลิซิส"
   --------------------------------------------------------- */
const reactionDatabase = [

  /* ===== 1-3: ปฏิกิริยาการแทนที่ของแอลเคน (ต้องมีแสง UV) ===== */
  {
    id: "alkane_methane_cl2_uv",
    reactionType: "การแทนที่",
    reactant: "methane",
    reagent: "Cl2",
    condition: "uv",
    equation: "CH4 + Cl2 -> CH3Cl + HCl",
    wordEquation: "methane + chlorine → chloromethane + hydrogen chloride",
    product: "chloromethane (CH3Cl)",
    observation: "สีของแก๊สคลอรีนจางลงเมื่อมีแสง UV ส่องผ่าน เกิดควันขาวบาง ๆ ของ HCl",
    explanation: "แสง UV ทำให้ Cl2 แตกตัวเป็นอนุมูลอิสระ (Cl•) ซึ่งเข้าไปแทนที่ H อะตอมหนึ่งใน methane เกิดเป็นฮาโลแอลเคนและ HCl เป็นผลพลอยได้ เรียกว่าปฏิกิริยาการแทนที่ (substitution)",
    colorChange: "yellow-green fades",
    animationType: "substitution-radical",
    worksheetQuestion: "เพราะเหตุใดปฏิกิริยานี้จึงต้องใช้แสง UV จึงจะเกิดได้ชัดเจน",
    hint: "พิจารณาว่า Cl2 ต้องแตกพันธะเป็นอนุมูลอิสระก่อนจึงจะเข้าทำปฏิกิริยาได้",
    commonMistake: "เข้าใจผิดว่า methane ทำปฏิกิริยากับ Cl2 ได้ทันทีโดยไม่ต้องมีแสง UV"
  },
  {
    id: "alkane_ethane_cl2_uv",
    reactionType: "การแทนที่",
    reactant: "ethane",
    reagent: "Cl2",
    condition: "uv",
    equation: "C2H6 + Cl2 -> C2H5Cl + HCl",
    wordEquation: "ethane + chlorine → chloroethane + hydrogen chloride",
    product: "chloroethane (C2H5Cl)",
    observation: "สีเหลืองอมเขียวอ่อนของ Cl2 จางลงเมื่อมีแสง UV เกิดไอ HCl",
    explanation: "แสง UV กระตุ้นให้ Cl2 แตกตัวเป็นอนุมูลอิสระ แล้วเข้าแทนที่ H บน ethane เกิดฮาโลแอลเคนชนิด chloroethane",
    colorChange: "yellow-green fades",
    animationType: "substitution-radical",
    worksheetQuestion: "ผลิตภัณฑ์ร่วมที่เกิดขึ้นพร้อมกับ chloroethane คืออะไร และเกิดขึ้นได้อย่างไร",
    hint: "อะตอม H ที่ถูกแทนที่ออกไปจะไปจับกับอะตอมใด",
    commonMistake: "ลืมว่าผลิตภัณฑ์ร่วมเสมอของการแทนที่ด้วยฮาโลเจนคือ HX"
  },
  {
    id: "alkane_propane_cl2_uv",
    reactionType: "การแทนที่",
    reactant: "propane",
    reagent: "Cl2",
    condition: "uv",
    equation: "C3H8 + Cl2 -> C3H7Cl + HCl",
    wordEquation: "propane + chlorine → chloropropane + hydrogen chloride",
    product: "chloropropane (C3H7Cl)",
    observation: "สี Cl2 จางลงภายใต้แสง UV เกิดผลิตภัณฑ์ฮาโลแอลเคนผสมได้มากกว่า 1 ตำแหน่ง",
    explanation: "propane มี H หลายตำแหน่งที่ไม่เท่ากัน การแทนที่จึงอาจเกิดได้มากกว่า 1 ไอโซเมอร์ แต่หลักการเหมือนเดิมคือ Cl อนุมูลอิสระเข้าแทนที่ H",
    colorChange: "yellow-green fades",
    animationType: "substitution-radical",
    worksheetQuestion: "เหตุใด propane จึงอาจให้ผลิตภัณฑ์ฮาโลแอลเคนได้มากกว่าหนึ่งชนิด",
    hint: "ลองนับตำแหน่งของอะตอม H ที่ไม่เหมือนกันในโครงสร้าง propane",
    commonMistake: "คิดว่าการแทนที่เกิดที่ตำแหน่งเดียวเสมอ"
  },

  /* ===== 4-5: การเติมของแอลคีนกับ Br2 ===== */
  {
    id: "alkene_ethene_br2",
    reactionType: "การเติม",
    reactant: "ethene",
    reagent: "Br2",
    condition: "none",
    equation: "CH2=CH2 + Br2 -> CH2BrCH2Br",
    wordEquation: "ethene + bromine → 1,2-dibromoethane",
    product: "1,2-dibromoethane",
    observation: "สีส้ม/น้ำตาลแดงของ Br2 จางลงอย่างรวดเร็วแม้ไม่ต้องให้ความร้อนหรือแสง",
    explanation: "พันธะคู่ C=C ใน ethene เปิดออกและ Br แต่ละอะตอมเข้าไปจับกับคาร์บอนแต่ละอะตอม เกิดเป็นสารประกอบไดโบรโม เรียกว่าปฏิกิริยาการเติม (addition)",
    colorChange: "orange-brown to colorless",
    animationType: "addition-bond-open",
    worksheetQuestion: "เพราะเหตุใดสีของ Br2 จึงจางลงเมื่อหยดลงใน ethene",
    hint: "พิจารณาว่าสารตั้งต้นมีพันธะคู่หรือไม่",
    commonMistake: "เข้าใจผิดว่าแอลเคนทำให้ Br2 จางลงได้โดยไม่ต้องใช้ UV เช่นเดียวกับแอลคีน"
  },
  {
    id: "alkene_propene_br2",
    reactionType: "การเติม",
    reactant: "propene",
    reagent: "Br2",
    condition: "none",
    equation: "CH3CH=CH2 + Br2 -> CH3CHBrCH2Br",
    wordEquation: "propene + bromine → 1,2-dibromopropane",
    product: "1,2-dibromopropane",
    observation: "สีของ Br2 จางลงทันทีที่สัมผัสกับ propene",
    explanation: "พันธะคู่ C=C ใน propene เปิดออกรับ Br ทั้งสองอะตอมเข้ามาที่ตำแหน่งพันธะคู่เดิม เป็นปฏิกิริยาการเติมแบบเดียวกับ ethene",
    colorChange: "orange-brown to colorless",
    animationType: "addition-bond-open",
    worksheetQuestion: "ปฏิกิริยานี้ใช้เป็นชุดทดสอบเพื่อแยกแอลคีนออกจากแอลเคนได้อย่างไร",
    hint: "เปรียบเทียบความเร็วของการจางสีระหว่างสารที่มีและไม่มีพันธะคู่",
    commonMistake: "ลืมว่าปฏิกิริยานี้ไม่ต้องการแสง UV ต่างจากการแทนที่ในแอลเคน"
  },

  /* ===== 6-7: การเติม H2 (hydrogenation) ===== */
  {
    id: "alkene_ethene_h2",
    reactionType: "การเติม",
    reactant: "ethene",
    reagent: "H2",
    condition: "catalyst",
    equation: "CH2=CH2 + H2 -> CH3CH3",
    wordEquation: "ethene + hydrogen → ethane",
    product: "ethane",
    observation: "ไม่มีการเปลี่ยนสีที่สังเกตเห็นชัด แต่ปริมาตรแก๊ส H2 ลดลงเมื่อมีตัวเร่งปฏิกิริยา",
    explanation: "พันธะคู่ C=C ใน ethene เปิดออกรับ H อะตอมเข้ามาทั้งสองข้าง กลายเป็นพันธะเดี่ยวทั้งหมด ต้องอาศัยตัวเร่งปฏิกิริยา (เช่น Ni) ปฏิกิริยานี้เรียกว่า hydrogenation",
    colorChange: "no visible color change",
    animationType: "addition-hydrogenation",
    worksheetQuestion: "เพราะเหตุใดปฏิกิริยานี้จึงต้องมีตัวเร่งปฏิกิริยา",
    hint: "พันธะ H-H และพันธะคู่ C=C ค่อนข้างเสถียร ต้องการพลังงานกระตุ้นจากตัวเร่ง",
    commonMistake: "คิดว่าจะสังเกตเห็นการเปลี่ยนสีเหมือนปฏิกิริยากับ Br2"
  },
  {
    id: "alkene_propene_h2",
    reactionType: "การเติม",
    reactant: "propene",
    reagent: "H2",
    condition: "catalyst",
    equation: "CH3CH=CH2 + H2 -> CH3CH2CH3",
    wordEquation: "propene + hydrogen → propane",
    product: "propane",
    observation: "ไม่มีการเปลี่ยนสีชัดเจน สังเกตได้จากปริมาณแก๊ส H2 ที่ลดลงเมื่อมีตัวเร่งปฏิกิริยา",
    explanation: "พันธะคู่ C=C ของ propene รับ H เข้ามาทั้งสองด้านโดยมีตัวเร่งปฏิกิริยาช่วย กลายเป็น propane ซึ่งเป็นแอลเคน",
    colorChange: "no visible color change",
    animationType: "addition-hydrogenation",
    worksheetQuestion: "ผลิตภัณฑ์ที่ได้จัดเป็นสารประเภทใด เพราะเหตุใด",
    hint: "พิจารณาว่าหลังเติม H2 ครบแล้ว เหลือพันธะคู่อยู่หรือไม่",
    commonMistake: "เข้าใจผิดว่าไม่ต้องใช้ตัวเร่งปฏิกิริยาก็เกิดได้"
  },

  /* ===== 8: การเติม HCl ===== */
  {
    id: "alkene_ethene_hcl",
    reactionType: "การเติม",
    reactant: "ethene",
    reagent: "HCl",
    condition: "none",
    equation: "CH2=CH2 + HCl -> CH3CH2Cl",
    wordEquation: "ethene + hydrogen chloride → chloroethane",
    product: "chloroethane",
    observation: "ไม่มีสีให้สังเกตชัดเจน แต่แก๊ส HCl ทำปฏิกิริยากับ ethene ได้โดยตรง",
    explanation: "พันธะคู่ C=C เปิดออก รับ H เข้าไปที่คาร์บอนหนึ่งและ Cl เข้าไปที่อีกคาร์บอนหนึ่ง เป็นปฏิกิริยาการเติมชนิด hydrohalogenation",
    colorChange: "no visible color change",
    animationType: "addition-hydrohalogenation",
    worksheetQuestion: "เปรียบเทียบผลิตภัณฑ์ที่ได้จากปฏิกิริยานี้กับปฏิกิริยา ethene + Br2 ว่าต่างกันอย่างไร",
    hint: "พิจารณาว่าอะตอมใดเข้าไปแทนที่ตำแหน่งพันธะคู่ทั้งสองข้าง",
    commonMistake: "เข้าใจผิดว่าได้ผลิตภัณฑ์ไดฮาโล เหมือนปฏิกิริยากับ Br2"
  },

  /* ===== 9: การเติมของแอลไคน์ ===== */
  {
    id: "alkyne_ethyne_br2",
    reactionType: "การเติม",
    reactant: "ethyne",
    reagent: "Br2",
    condition: "none",
    equation: "HC#CH + Br2 -> CHBr=CHBr",
    wordEquation: "ethyne + bromine → 1,2-dibromoethene",
    product: "1,2-dibromoethene (เกิด 1,1,2,2-tetrabromoethane ต่อได้หาก Br2 มากพอ)",
    observation: "สีของ Br2 จางลง และจางลงอีกครั้งหากเติม Br2 ส่วนเกิน",
    explanation: "พันธะสามใน ethyne เปิดออกทีละขั้น เริ่มจากรับ Br2 หนึ่งโมเลกุลกลายเป็นพันธะคู่ก่อน หากมี Br2 มากพอจะรับเพิ่มอีกจนกลายเป็นพันธะเดี่ยวทั้งหมด",
    colorChange: "orange-brown fades (twice if excess Br2)",
    animationType: "addition-triple-bond",
    worksheetQuestion: "ถ้าใช้ Br2 ปริมาณมากเกินพอ ผลิตภัณฑ์สุดท้ายที่ได้คือสารใด",
    hint: "พันธะสามสามารถรับ Br2 ได้กี่โมเลกุลกว่าจะกลายเป็นพันธะเดี่ยวทั้งหมด",
    commonMistake: "คิดว่าพันธะสามรับ Br2 ได้เพียงครั้งเดียวเท่านั้น"
  },

  /* ===== 10-12: การเผาไหม้ ===== */
  {
    id: "combustion_methane_complete",
    reactionType: "การเผาไหม้",
    reactant: "methane",
    reagent: "O2",
    condition: "heat_excess_o2",
    equation: "CH4 + 2O2 -> CO2 + 2H2O",
    wordEquation: "methane + oxygen → carbon dioxide + water",
    product: "carbon dioxide และ water",
    observation: "เปลวไฟสีน้ำเงินใส ไม่มีเขม่า เกิดฟองแก๊ส CO2 และหยดน้ำ",
    explanation: "เมื่อมีออกซิเจนเพียงพอ ไฮโดรคาร์บอนจะเผาไหม้สมบูรณ์ได้ผลิตภัณฑ์เป็น CO2 และ H2O เท่านั้น ให้เปลวไฟสะอาด",
    colorChange: "blue clean flame",
    animationType: "combustion-complete",
    worksheetQuestion: "เพราะเหตุใดเปลวไฟจากการเผาไหม้สมบูรณ์จึงมีสีน้ำเงินและไม่มีเขม่า",
    hint: "พิจารณาว่าคาร์บอนทุกอะตอมถูกออกซิไดซ์จนครบเป็น CO2 หรือไม่",
    commonMistake: "เข้าใจผิดว่าการเผาไหม้ทุกครั้งให้เขม่าดำเสมอ"
  },
  {
    id: "combustion_ethane_complete",
    reactionType: "การเผาไหม้",
    reactant: "ethane",
    reagent: "O2",
    condition: "heat_excess_o2",
    equation: "2C2H6 + 7O2 -> 4CO2 + 6H2O",
    wordEquation: "ethane + oxygen → carbon dioxide + water",
    product: "carbon dioxide และ water",
    observation: "เปลวไฟสะอาด เกิดฟองแก๊ส CO2 และหยดน้ำเกาะที่ผนังภาชนะ",
    explanation: "ethane เผาไหม้สมบูรณ์เมื่อมี O2 เพียงพอ ได้ CO2 และ H2O เป็นผลิตภัณฑ์ ปลดปล่อยพลังงานความร้อนออกมา",
    colorChange: "clean flame",
    animationType: "combustion-complete",
    worksheetQuestion: "เขียนสมการเคมีที่ดุลแล้วของการเผาไหม้สมบูรณ์ของ ethane",
    hint: "นับจำนวนอะตอม C และ H ใน ethane ก่อนดุลสมการ O2",
    commonMistake: "ลืมดุลสมการให้จำนวนอะตอมแต่ละธาตุเท่ากันทั้งสองข้าง"
  },
  {
    id: "combustion_propane_complete",
    reactionType: "การเผาไหม้",
    reactant: "propane",
    reagent: "O2",
    condition: "heat_excess_o2",
    equation: "C3H8 + 5O2 -> 3CO2 + 4H2O",
    wordEquation: "propane + oxygen → carbon dioxide + water",
    product: "carbon dioxide และ water",
    observation: "เปลวไฟสีน้ำเงินใส ไม่มีควันดำ เกิดฟองแก๊ส CO2 และหยดน้ำ",
    explanation: "เมื่อมีออกซิเจนเพียงพอ propane เผาไหม้สมบูรณ์ได้ CO2 และ H2O เป็นผลิตภัณฑ์เท่านั้น ให้เปลวไฟสะอาด",
    colorChange: "blue clean flame",
    animationType: "combustion-complete",
    worksheetQuestion: "เปรียบเทียบเปลวไฟและผลิตภัณฑ์ระหว่างกรณี O2 เพียงพอกับไม่เพียงพอ",
    hint: "พิจารณาว่าคาร์บอนทุกอะตอมถูกออกซิไดซ์จนครบเป็น CO2 ได้หรือไม่เมื่อ O2 มีเพียงพอ",
    commonMistake: "เข้าใจผิดว่า propane เผาไหม้ไม่สมบูรณ์เสมอไม่ว่าจะมี O2 มากเพียงใด"
  },
  {
    id: "combustion_propane_incomplete",
    reactionType: "การเผาไหม้",
    reactant: "propane",
    reagent: "O2",
    condition: "heat_limited_o2",
    equation: "2C3H8 + 7O2 -> 6CO + 8H2O",
    wordEquation: "propane + oxygen (ไม่เพียงพอ) → carbon monoxide + water",
    product: "carbon monoxide (CO) และ water (และอาจมีเขม่าคาร์บอนปนอยู่)",
    observation: "เปลวไฟสีส้ม มีควันดำ/เขม่าเกิดขึ้น",
    explanation: "เมื่อออกซิเจนไม่เพียงพอ การเผาไหม้จะไม่สมบูรณ์ ได้ CO ซึ่งเป็นแก๊สพิษ หรือเขม่าคาร์บอน (C) ปนกับไอน้ำ",
    colorChange: "orange flame with black smoke",
    animationType: "combustion-incomplete",
    worksheetQuestion: "เหตุใดการเผาไหม้ไม่สมบูรณ์จึงเป็นอันตรายมากกว่าการเผาไหม้สมบูรณ์",
    hint: "พิจารณาความเป็นพิษของแก๊สที่เกิดขึ้นเมื่อ O2 ไม่เพียงพอ",
    commonMistake: "เข้าใจผิดว่าผลิตภัณฑ์จากการเผาไหม้ไม่สมบูรณ์เป็น CO2 เสมอ"
  },

  /* ===== 13-15: ออกซิเดชันของแอลกอฮอล์ ===== */
  {
    id: "oxidation_ethanol_kmno4",
    reactionType: "ออกซิเดชัน",
    reactant: "ethanol",
    reagent: "KMnO4",
    condition: "heat",
    equation: "CH3CH2OH + 2[O] -> CH3COOH + H2O",
    wordEquation: "ethanol + oxidizing agent → ethanoic acid + water",
    product: "ethanoic acid (CH3COOH)",
    observation: "สีม่วงของ KMnO4 จางลงและอาจเปลี่ยนเป็นสีน้ำตาล (เกิดตะกอน MnO2)",
    explanation: "ethanol เป็นแอลกอฮอล์ปฐมภูมิ จึงถูกออกซิไดซ์ต่อเนื่องจนได้กรดคาร์บอกซิลิก สังเกตได้จากสีของ KMnO4 ที่จางลงเมื่อถูกรีดิวซ์",
    colorChange: "purple to brown/colorless",
    animationType: "oxidation-kmno4",
    worksheetQuestion: "ผลิตภัณฑ์จากการออกซิไดซ์แอลกอฮอล์ปฐมภูมิคือสารประเภทใด",
    hint: "แอลกอฮอล์ปฐมภูมิถูกออกซิไดซ์ได้ลึกกว่าแอลกอฮอล์ทุติยภูมิ",
    commonMistake: "เข้าใจผิดว่าแอลกอฮอล์ทุกชนิดถูกออกซิไดซ์ได้ผลิตภัณฑ์ชนิดเดียวกัน"
  },
  {
    id: "oxidation_propan1ol_kmno4",
    reactionType: "ออกซิเดชัน",
    reactant: "propan-1-ol",
    reagent: "KMnO4",
    condition: "heat",
    equation: "CH3CH2CH2OH + 2[O] -> CH3CH2COOH + H2O",
    wordEquation: "propan-1-ol + oxidizing agent → propanoic acid + water",
    product: "propanoic acid",
    observation: "สีม่วงของ KMnO4 จางลง เปลี่ยนเป็นสีน้ำตาลหรือไม่มีสี",
    explanation: "propan-1-ol เป็นแอลกอฮอล์ปฐมภูมิเช่นเดียวกับ ethanol จึงถูกออกซิไดซ์เป็นกรดคาร์บอกซิลิกได้",
    colorChange: "purple to brown/colorless",
    animationType: "oxidation-kmno4",
    worksheetQuestion: "เหตุใด propan-1-ol จึงให้ผลิตภัณฑ์เป็นกรด ไม่ใช่คีโตน",
    hint: "พิจารณาตำแหน่งของหมู่ -OH ว่าอยู่ที่คาร์บอนปฐมภูมิหรือไม่",
    commonMistake: "สับสนระหว่างผลิตภัณฑ์ของแอลกอฮอล์ปฐมภูมิกับทุติยภูมิ"
  },
  {
    id: "oxidation_propan2ol_kmno4",
    reactionType: "ออกซิเดชัน",
    reactant: "propan-2-ol",
    reagent: "KMnO4",
    condition: "heat",
    equation: "CH3CH(OH)CH3 + [O] -> CH3COCH3 + H2O",
    wordEquation: "propan-2-ol + oxidizing agent → propanone + water",
    product: "propanone (acetone)",
    observation: "สีม่วงของ KMnO4 จางลงเช่นกัน แต่ผลิตภัณฑ์ที่ได้เป็นคีโตน ไม่ใช่กรด",
    explanation: "propan-2-ol เป็นแอลกอฮอล์ทุติยภูมิ เมื่อถูกออกซิไดซ์จะได้คีโตน (propanone) ซึ่งไม่ถูกออกซิไดซ์ต่อไปอีกในเงื่อนไขทั่วไป",
    colorChange: "purple fades",
    animationType: "oxidation-kmno4",
    worksheetQuestion: "แอลกอฮอล์ปฐมภูมิและทุติยภูมิให้ผลิตภัณฑ์จากออกซิเดชันต่างกันอย่างไร",
    hint: "เปรียบเทียบกับผลของ ethanol และ propan-1-ol ในการทดลองก่อนหน้า",
    commonMistake: "เข้าใจผิดว่า propan-2-ol ถูกออกซิไดซ์เป็นกรดได้เหมือนแอลกอฮอล์ปฐมภูมิ"
  },

  /* ===== 16-17: เอสเทอริฟิเคชัน ===== */
  {
    id: "esterification_ethanoic_ethanol",
    reactionType: "เอสเทอริฟิเคชัน",
    reactant: "ethanoic acid",
    reagent: "ethanol",
    condition: "acid_heat",
    equation: "CH3COOH + C2H5OH <=> CH3COOC2H5 + H2O",
    wordEquation: "ethanoic acid + ethanol ⇌ ethyl ethanoate + water",
    product: "ethyl ethanoate",
    observation: "เกิดกลิ่นหอมคล้ายผลไม้ มีชั้นของเหลวลอยแยกออกจากกัน",
    explanation: "กรดคาร์บอกซิลิกทำปฏิกิริยากับแอลกอฮอล์ โดยมีกรดเข้มข้นเป็นตัวเร่งและให้ความร้อน เกิดเป็นเอสเตอร์ที่มีกลิ่นหอมเฉพาะตัว ปฏิกิริยานี้ผันกลับได้ (reversible)",
    colorChange: "no major color change, fruity smell appears",
    animationType: "esterification",
    worksheetQuestion: "เพราะเหตุใดปฏิกิริยานี้จึงต้องใช้ทั้งกรดเข้มข้นและความร้อน",
    hint: "พิจารณาว่ากรดทำหน้าที่เป็นตัวเร่งปฏิกิริยา และความร้อนช่วยเพิ่มอัตราการเกิดปฏิกิริยา",
    commonMistake: "ลืมว่าปฏิกิริยานี้เป็นปฏิกิริยาผันกลับได้ ไม่ได้เกิดสมบูรณ์ 100%"
  },
  {
    id: "esterification_methanoic_methanol",
    reactionType: "เอสเทอริฟิเคชัน",
    reactant: "methanoic acid",
    reagent: "methanol",
    condition: "acid_heat",
    equation: "HCOOH + CH3OH <=> HCOOCH3 + H2O",
    wordEquation: "methanoic acid + methanol ⇌ methyl methanoate + water",
    product: "methyl methanoate",
    observation: "เกิดกลิ่นหอมเฉพาะตัวอ่อน ๆ มีน้ำเป็นผลิตภัณฑ์ร่วม",
    explanation: "methanoic acid ทำปฏิกิริยากับ methanol โดยมีกรดเข้มข้นเป็นตัวเร่งและให้ความร้อน ได้เอสเตอร์ขนาดเล็กที่สุดในกลุ่มนี้",
    colorChange: "no major color change, mild fruity smell",
    animationType: "esterification",
    worksheetQuestion: "ตั้งชื่อเอสเตอร์ที่ได้จากปฏิกิริยานี้ตามหลัก IUPAC",
    hint: "ชื่อเอสเตอร์ประกอบจากชื่อแอลกอฮอล์ + ชื่อกรด (ลงท้าย -oate)",
    commonMistake: "เขียนชื่อเอสเตอร์สลับส่วนของแอลกอฮอล์กับกรด"
  },

  /* ===== 18-20: ไฮโดรลิซิสของเอสเตอร์ ===== */
  {
    id: "hydrolysis_ethyl_ethanoate_water",
    reactionType: "ไฮโดรลิซิส",
    reactant: "ethyl ethanoate",
    reagent: "H2O",
    condition: "acid_heat",
    equation: "CH3COOC2H5 + H2O <=> CH3COOH + C2H5OH",
    wordEquation: "ethyl ethanoate + water ⇌ ethanoic acid + ethanol",
    product: "ethanoic acid และ ethanol",
    observation: "กลิ่นหอมของเอสเตอร์ลดลง เอสเตอร์แตกตัวกลับเป็นกรดและแอลกอฮอล์",
    explanation: "ไฮโดรลิซิสคือปฏิกิริยาย้อนกลับของเอสเทอริฟิเคชัน เมื่อมีน้ำและกรดเป็นตัวเร่งพร้อมความร้อน เอสเตอร์จะแตกตัวกลับเป็นกรดคาร์บอกซิลิกและแอลกอฮอล์",
    colorChange: "fruity smell decreases",
    animationType: "hydrolysis-acid",
    worksheetQuestion: "ปฏิกิริยานี้สัมพันธ์กับเอสเทอริฟิเคชันอย่างไร",
    hint: "พิจารณาทิศทางของลูกศรปฏิกิริยาเทียบกับเอสเทอริฟิเคชัน",
    commonMistake: "เข้าใจผิดว่าไฮโดรลิซิสในกรดให้ผลิตภัณฑ์เป็นเกลือคาร์บอกซิเลต"
  },
  {
    id: "hydrolysis_ethyl_ethanoate_naoh",
    reactionType: "ไฮโดรลิซิส",
    reactant: "ethyl ethanoate",
    reagent: "NaOH",
    condition: "heat",
    equation: "CH3COOC2H5 + NaOH -> CH3COONa + C2H5OH",
    wordEquation: "ethyl ethanoate + sodium hydroxide → sodium ethanoate + ethanol",
    product: "sodium ethanoate (เกลือ) และ ethanol",
    observation: "กลิ่นหอมของเอสเตอร์ลดลง เกิดสารละลายที่มีเกลือคาร์บอกซิเลตละลายอยู่",
    explanation: "ไฮโดรลิซิสในสภาวะเบส (saponification-like) เกิดแบบไม่ผันกลับ ให้ผลิตภัณฑ์เป็นเกลือของกรดคาร์บอกซิลิกแทนที่จะเป็นกรดอิสระ",
    colorChange: "fruity smell decreases",
    animationType: "hydrolysis-base",
    worksheetQuestion: "เพราะเหตุใดไฮโดรลิซิสด้วย NaOH จึงได้เกลือแทนที่จะได้กรดคาร์บอกซิลิกโดยตรง",
    hint: "พิจารณาว่า NaOH เป็นเบส จะทำปฏิกิริยากับกรดที่เกิดขึ้นต่อหรือไม่",
    commonMistake: "เข้าใจผิดว่าไฮโดรลิซิสด้วยกรดและเบสให้ผลิตภัณฑ์ชนิดเดียวกันทุกประการ"
  },
  {
    id: "hydrolysis_methyl_ethanoate_water",
    reactionType: "ไฮโดรลิซิส",
    reactant: "methyl ethanoate",
    reagent: "H2O",
    condition: "acid_heat",
    equation: "CH3COOCH3 + H2O <=> CH3COOH + CH3OH",
    wordEquation: "methyl ethanoate + water ⇌ ethanoic acid + methanol",
    product: "ethanoic acid และ methanol",
    observation: "กลิ่นหอมของเอสเตอร์ลดลงเมื่อเกิดไฮโดรลิซิส",
    explanation: "เอสเตอร์ขนาดเล็กอย่าง methyl ethanoate ก็เกิดไฮโดรลิซิสด้วยน้ำและกรดได้เช่นเดียวกับเอสเตอร์อื่น โดยแตกตัวกลับเป็นกรดและแอลกอฮอล์ต้นกำเนิด",
    colorChange: "fruity smell decreases",
    animationType: "hydrolysis-acid",
    worksheetQuestion: "เขียนสมการย้อนกลับ (เอสเทอริฟิเคชัน) ของปฏิกิริยานี้",
    hint: "สลับทิศทางของสมการและตัวเร่งปฏิกิริยายังคงเป็นกรด",
    commonMistake: "ลืมใส่เครื่องหมาย ⇌ เพื่อแสดงว่าปฏิกิริยาผันกลับได้"
  }
];

/* ---------------------------------------------------------
   3) ฟังก์ชันช่วยค้นหาในฐานข้อมูล (จะถูกเรียกใช้จากเฟสห้องทดลอง)
   ---------------------------------------------------------
   findReaction(reactant, reagent, condition)
   - ค้นหาแบบ "ตรงเงื่อนไขที่สุด" ก่อน (reactant+reagent+condition)
   - ถ้าไม่พบ ให้ลองหาแบบ reactant+reagent อย่างเดียว (ไม่สนเงื่อนไข)
     เพื่อนำไปใช้แสดงข้อความแนะนำ เช่น "ยังขาดเงื่อนไข UV"
   --------------------------------------------------------- */
function findReaction(reactant, reagent, condition) {
  // 1. หาแบบตรงทั้งสามเงื่อนไข
  let exact = reactionDatabase.find(r =>
    r.reactant === reactant &&
    r.reagent === reagent &&
    r.condition === condition
  );
  if (exact) return { match: "exact", data: exact };

  // 2. หาแบบไม่สนเงื่อนไข (สาร+รีเอเจนต์ตรงกัน แต่เงื่อนไขไม่ครบ)
  let partial = reactionDatabase.find(r =>
    r.reactant === reactant &&
    r.reagent === reagent
  );
  if (partial) return { match: "partial", data: partial };

  // 3. ไม่พบเลย
  return { match: "none", data: null };
}

/* รายชื่อสารอินทรีย์ทั้งหมดที่ใช้ในระบบ แบ่งตามหมู่ (สำหรับ dropdown ในเฟสถัดไป) */
const organicSubstances = {
  alkane: ["methane", "ethane", "propane"],
  alkene: ["ethene", "propene"],
  alkyne: ["ethyne"],
  alcohol: ["methanol", "ethanol", "propan-1-ol", "propan-2-ol"],
  carboxylicAcid: ["methanoic acid", "ethanoic acid"],
  ester: ["methyl ethanoate", "ethyl ethanoate"]
};

/* รายชื่อรีเอเจนต์ทั้งหมด (สำหรับ dropdown ในเฟสถัดไป) */
const reagentList = [
  "Cl2", "Br2", "H2", "HCl", "O2",
  "KMnO4", "K2Cr2O7", "CH3COOH", "C2H5OH", "H2O", "NaOH"
];

/* รายชื่อเงื่อนไขทั้งหมด (สำหรับ dropdown ในเฟสถัดไป) */
const conditionList = [
  { value: "none", label: "ไม่มีเงื่อนไข" },
  { value: "uv", label: "แสง UV" },
  { value: "heat", label: "ความร้อน" },
  { value: "catalyst", label: "ตัวเร่งปฏิกิริยา" },
  { value: "acid_heat", label: "กรดเข้มข้น + ความร้อน" },
  { value: "naoh", label: "สารละลายเบส (NaOH)" },
  { value: "heat_excess_o2", label: "ความร้อน + ออกซิเจนเพียงพอ" },
  { value: "heat_limited_o2", label: "ความร้อน + ออกซิเจนไม่เพียงพอ" }
];

/* ป้องกัน error กรณีเปิดไฟล์นี้ก่อนหน้าอื่น ๆ ของเฟสถัดไปจะถูกเพิ่มเข้ามา */
console.log(`[reactionDatabase] โหลดข้อมูลสำเร็จ จำนวน ${reactionDatabase.length} ปฏิกิริยา`);


/* =========================================================
   เฟส 2: ระบบหน้า (Navigation) + ผู้ใช้งาน (User State)
   ---------------------------------------------------------
   - userState เก็บชื่อ, ชั้น, โหมด (student/teacher)
   - บันทึก/โหลดจาก localStorage คีย์ "organicLab_user"
   - goToPage(pageId) สลับหน้าและอัปเดตปุ่มเมนูที่ active
   ========================================================= */

const STORAGE_KEY_USER = "organicLab_user";

let userState = {
  name: "",
  className: "",
  mode: "student" // "student" | "teacher"
};

/* โหลดข้อมูลผู้ใช้เดิมจาก localStorage (ถ้ามี) */
function loadUserState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) {
      const parsed = JSON.parse(raw);
      userState = { ...userState, ...parsed };
      return true;
    }
  } catch (e) {
    console.warn("ไม่สามารถโหลดข้อมูลผู้ใช้เดิมได้", e);
  }
  return false;
}

/* บันทึกข้อมูลผู้ใช้ปัจจุบันลง localStorage */
function saveUserState() {
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userState));
  } catch (e) {
    console.warn("ไม่สามารถบันทึกข้อมูลผู้ใช้ได้", e);
  }
}

/* อัปเดต UI ของแถบ navigation ให้ตรงกับ userState ปัจจุบัน */
function refreshNavUserDisplay() {
  const nameEl = document.getElementById("nav-user-name");
  const modeEl = document.getElementById("nav-user-mode");
  if (nameEl) nameEl.textContent = userState.name ? `${userState.name}` : "-";
  if (modeEl) {
    modeEl.textContent = userState.mode === "teacher" ? "ครู" : "นักเรียน";
    modeEl.classList.toggle("badge--teacher", userState.mode === "teacher");
  }
}

/* สลับไปหน้าที่ระบุด้วย id (เช่น "page-lab") */
function goToPage(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach(p => p.classList.remove("page--active"));

  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add("page--active");
  } else {
    console.warn(`ไม่พบหน้า: ${pageId}`);
  }

  // อัปเดตปุ่มเมนูที่ active
  document.querySelectorAll(".nav-link").forEach(btn => {
    btn.classList.toggle("nav-link--active", btn.dataset.page === pageId);
  });

  // เลื่อนขึ้นบนสุดทุกครั้งที่เปลี่ยนหน้า เพื่อ UX ที่ดีบนมือถือ
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* แสดงแถบ navigation (เรียกหลังจากผู้ใช้กด "เริ่มทดลอง" สำเร็จ) */
function showMainNav() {
  const nav = document.getElementById("main-nav");
  if (nav) nav.classList.remove("main-nav--hidden");
}

/* ---------------------------------------------------------
   ผูก event ทั้งหมดเมื่อ DOM พร้อมใช้งาน
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

  // 1) ถ้ามีข้อมูลผู้ใช้เดิม ให้เติมในฟอร์มและโชว์ข้อความต้อนรับกลับ
  const hadPreviousUser = loadUserState();
  if (hadPreviousUser && userState.name) {
    const nameInput = document.getElementById("input-name");
    const classInput = document.getElementById("input-class");
    if (nameInput) nameInput.value = userState.name;
    if (classInput) classInput.value = userState.className;

    const welcomeMsg = document.getElementById("welcome-back-msg");
    if (welcomeMsg) {
      welcomeMsg.style.display = "block";
      welcomeMsg.textContent = `ยินดีต้อนรับกลับ คุณ ${userState.name} 👋 (แก้ไขข้อมูลได้ก่อนกดเริ่มทดลอง)`;
    }

    setActiveModeButton(userState.mode);
  }

  // 2) ปุ่มเลือกโหมด (นักเรียน/ครู)
  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      userState.mode = btn.dataset.mode;
      setActiveModeButton(userState.mode);
    });
  });

  // 3) ฟอร์มเริ่มทดลอง (หน้าแรก)
  const startForm = document.getElementById("start-form");
  if (startForm) {
    startForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("input-name").value.trim();
      const className = document.getElementById("input-class").value.trim();

      if (!name || !className) {
        alert("กรุณากรอกชื่อ-สกุล และชั้น/เลขที่ ให้ครบก่อนเริ่มทดลอง");
        return;
      }

      userState.name = name;
      userState.className = className;
      // ถ้ายังไม่ได้เลือกโหมด ให้ default เป็นนักเรียน
      if (!userState.mode) userState.mode = "student";

      saveUserState();
      refreshNavUserDisplay();
      showMainNav();
      goToPage("page-guide"); // หลังกรอกข้อมูลเสร็จ พาไปหน้าคู่มือก่อน
    });
  }

  // 4) ปุ่มเมนู navigation ด้านบน
  document.querySelectorAll(".nav-link").forEach(btn => {
    btn.addEventListener("click", () => {
      goToPage(btn.dataset.page);
    });
  });
});

/* ทำให้ปุ่มโหมดที่เลือกอยู่ดูเด่นกว่าอีกปุ่ม */
function setActiveModeButton(mode) {
  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.classList.toggle("mode-btn--active", btn.dataset.mode === mode);
  });
}


/* =========================================================
   เฟส 3: ห้องทดลองปฏิกิริยา
   ---------------------------------------------------------
   labState เก็บค่าที่ผู้ใช้เลือก/ปรับทั้งหมดในแผงควบคุม
   currentExperimentResult เก็บผลการทดลองล่าสุด (เฟสถัดไปจะ
   นำไปบันทึกลงตารางได้)
   ========================================================= */

let labState = {
  reactionType: "",
  reactant: "",
  reagent: "",
  toggles: { uv: false, heat: false, catalyst: false, acid: false },
  o2Level: 8,
  reactantAmount: 5,
  reagentAmount: 5,
  temperature: 25,
  time: 1,
  hasDropped: false
};

let currentExperimentResult = null; // ผลการทดลองล่าสุด ใช้ในเฟส 4-7

/* ---------------------------------------------------------
   คำนวณ "condition" string ให้ตรงกับรูปแบบที่ reactionDatabase ใช้
   โดยอิงจากรีเอเจนต์และ toggle ที่ผู้ใช้เปิดอยู่
   --------------------------------------------------------- */
function computeCondition() {
  const t = labState.toggles;

  // กรณีรีเอเจนต์เป็น O2 (การเผาไหม้) ให้พิจารณาระดับ O2 แทน toggle อื่น
  if (labState.reagent === "O2") {
    const sufficient = labState.o2Level >= 5;
    return sufficient ? "heat_excess_o2" : "heat_limited_o2";
  }

  if (t.uv) return "uv";
  if (t.acid && t.heat) return "acid_heat";
  if (t.catalyst) return "catalyst";
  if (t.heat) return "heat";
  return "none";
}

/* ---------------------------------------------------------
   อัปเดต UI ของแผงควบคุมให้ตรงกับ labState (label, readout)
   --------------------------------------------------------- */
function syncControlReadouts() {
  document.getElementById("reactant-amount-val").textContent = labState.reactantAmount;
  document.getElementById("reagent-amount-val").textContent = labState.reagentAmount;
  document.getElementById("temp-val").textContent = labState.temperature;
  document.getElementById("time-val").textContent = labState.time;

  const o2Label = document.getElementById("o2-readout-label");
  if (o2Label) {
    o2Label.textContent = labState.o2Level >= 5 ? "ออกซิเจนเพียงพอ" : "ออกซิเจนไม่เพียงพอ";
  }

  // โชว์ slider O2 เฉพาะเมื่อเลือกรีเอเจนต์เป็น O2
  const o2Group = document.getElementById("o2-level-group");
  if (o2Group) {
    o2Group.style.display = labState.reagent === "O2" ? "block" : "none";
  }

  // อัปเดตป้ายชื่อขวดสาร
  const reactantLabel = document.getElementById("bottle-reactant-label");
  const reagentLabel = document.getElementById("bottle-reagent-label");
  if (reactantLabel) reactantLabel.textContent = labState.reactant || "สารตั้งต้น";
  if (reagentLabel) reagentLabel.textContent = labState.reagent || "รีเอเจนต์";
}

/* ---------------------------------------------------------
   startExperiment()
   ค้นหาปฏิกิริยาจาก reactionDatabase ตามค่าที่เลือก แล้วแสดงผล
   --------------------------------------------------------- */
function startExperiment() {
  if (!labState.reactant || !labState.reagent) {
    alert("กรุณาเลือกสารอินทรีย์และรีเอเจนต์ก่อนเริ่มปฏิกิริยา");
    return;
  }

  const condition = computeCondition();
  const searchResult = findReaction(labState.reactant, labState.reagent, condition);

  currentExperimentResult = {
    timestamp: new Date().toISOString(),
    reactant: labState.reactant,
    reagent: labState.reagent,
    condition: condition,
    reactantAmount: labState.reactantAmount,
    reagentAmount: labState.reagentAmount,
    temperature: labState.temperature,
    time: labState.time,
    matchType: searchResult.match,
    data: searchResult.data
  };

  updateObservationPanel(searchResult, condition);

  if (searchResult.match === "exact") {
    playReactionAnimation(searchResult.data.animationType, searchResult.data);
  } else {
    playReactionAnimation(null, null); // ไม่มีปฏิกิริยาชัดเจน -> ไม่มี animation พิเศษ
  }
}

/* ---------------------------------------------------------
   updateObservationPanel(searchResult, condition)
   แสดงผลในส่วน C ตามผลการค้นหา 3 กรณี: exact / partial / none
   --------------------------------------------------------- */
function updateObservationPanel(searchResult, condition) {
  const emptyState = document.getElementById("result-empty-state");
  const content = document.getElementById("result-content");
  emptyState.style.display = "none";
  content.style.display = "block";

  const statusEl = document.getElementById("result-status");
  const typeEl = document.getElementById("result-type");
  const equationEl = document.getElementById("result-equation");
  const wordEquationEl = document.getElementById("result-word-equation");
  const productEl = document.getElementById("result-product");
  const observationEl = document.getElementById("result-observation");
  const explanationEl = document.getElementById("result-explanation");
  const noteEl = document.getElementById("result-note");
  const questionEl = document.getElementById("result-worksheet-question");

  statusEl.classList.remove("result-status--none", "result-status--partial");
  noteEl.style.display = "none";

  if (searchResult.match === "exact") {
    const r = searchResult.data;
    statusEl.textContent = "✅ เกิดปฏิกิริยา";
    typeEl.textContent = r.reactionType;
    setFormulaHTML(equationEl, r.equation);
    wordEquationEl.textContent = r.wordEquation;
    productEl.textContent = r.product;
    observationEl.textContent = r.observation;
    explanationEl.textContent = r.explanation;
    questionEl.textContent = r.worksheetQuestion;

    // ตรวจปริมาณรีเอเจนต์: ถ้าน้อยเกินไป ให้เตือนเพิ่มเติม
    if (labState.reagentAmount < 3) {
      noteEl.style.display = "block";
      noteEl.textContent = "⚠️ รีเอเจนต์อาจไม่เพียงพอต่อการเกิดปฏิกิริยาอย่างสมบูรณ์ ลองเพิ่มปริมาณรีเอเจนต์";
    }

  } else if (searchResult.match === "partial") {
    const r = searchResult.data;
    statusEl.textContent = "🟡 ต้องมีเงื่อนไขเพิ่ม";
    statusEl.classList.add("result-status--partial");
    typeEl.textContent = r.reactionType + " (ยังไม่ครบเงื่อนไข)";
    setFormulaHTML(equationEl, r.equation + "  (ยังไม่เกิดในเงื่อนไขปัจจุบัน)");
    wordEquationEl.textContent = r.wordEquation;
    productEl.textContent = "ยังไม่เกิดผลิตภัณฑ์ชัดเจนในเงื่อนไขนี้";
    observationEl.textContent = "เกิดช้ามากหรือไม่ชัดเจนในสภาวะนี้";
    explanationEl.textContent = `ปฏิกิริยานี้ต้องการเงื่อนไข "${r.condition}" จึงจะเกิดได้ชัดเจน ลองเปิด/ปิดเงื่อนไขในแผงควบคุมแล้วลองใหม่`;
    questionEl.textContent = r.worksheetQuestion;

  } else {
    statusEl.textContent = "❌ ไม่เกิดปฏิกิริยา";
    statusEl.classList.add("result-status--none");
    typeEl.textContent = "-";
    setFormulaHTML(equationEl, "-");
    wordEquationEl.textContent = "-";
    productEl.textContent = "-";
    observationEl.textContent = "ยังไม่พบปฏิกิริยาที่ชัดเจนในเงื่อนไขนี้ ลองปรับชนิดสาร รีเอเจนต์ หรือเงื่อนไข แล้วสังเกตผลใหม่";
    explanationEl.textContent = "-";
    questionEl.textContent = "-";
  }
}

/* ---------------------------------------------------------
   playReactionAnimation(type, reactionData)
   เล่น animation ในพื้นที่จำลองตามชนิดของปฏิกิริยา
   --------------------------------------------------------- */
function playReactionAnimation(type, reactionData) {
  const liquid = document.getElementById("testtube-liquid");
  const bubbles = document.getElementById("bubbles");
  const flame = document.getElementById("flame");
  const smoke = document.getElementById("smoke");
  const smell = document.getElementById("smell-icon");

  // รีเซ็ตสถานะ animation ก่อนเล่นใหม่ทุกครั้ง
  bubbles.classList.remove("bubbles--active");
  flame.classList.remove("flame--on", "flame--incomplete");
  smoke.classList.remove("smoke--active");
  smell.classList.remove("smell-icon--active");

  if (!type) {
    liquid.style.background = "#d9e3f0";
    liquid.style.height = "45%";
    return;
  }

  switch (type) {
    case "substitution-radical":
      liquid.style.background = "#e9e276"; // เหลืองอมเขียวจาง
      liquid.style.height = "40%";
      bubbles.classList.add("bubbles--active");
      break;

    case "addition-bond-open":
    case "addition-triple-bond":
      liquid.style.background = "#f3d9b1"; // ส้ม/น้ำตาลแดงจางลง
      liquid.style.height = "42%";
      break;

    case "addition-hydrogenation":
    case "addition-hydrohalogenation":
      liquid.style.background = "#dceeff";
      liquid.style.height = "42%";
      bubbles.classList.add("bubbles--active");
      break;

    case "combustion-complete":
      liquid.style.background = "#dceeff";
      liquid.style.height = "30%";
      flame.classList.add("flame--on");
      bubbles.classList.add("bubbles--active");
      break;

    case "combustion-incomplete":
      liquid.style.background = "#e6ded2";
      liquid.style.height = "30%";
      flame.classList.add("flame--on", "flame--incomplete");
      smoke.classList.add("smoke--active");
      break;

    case "oxidation-kmno4":
      liquid.style.background = "#c9a4d8"; // ม่วงจางลง/น้ำตาล
      liquid.style.height = "42%";
      break;

    case "esterification":
      liquid.style.background = "#ffe9c7";
      liquid.style.height = "45%";
      smell.classList.add("smell-icon--active");
      break;

    case "hydrolysis-acid":
    case "hydrolysis-base":
      liquid.style.background = "#e8e8f5";
      liquid.style.height = "40%";
      break;

    default:
      liquid.style.background = "#d9e3f0";
  }

  // เปิดแสง UV ในแอนิเมชันถ้าเป็นปฏิกิริยาการแทนที่ (ไม่ว่าผู้ใช้จะกดปุ่มหรือยัง)
  if (type === "substitution-radical") {
    document.getElementById("uv-beam").classList.add("uv-beam--on");
  }
}

/* ---------------------------------------------------------
   resetExperiment()
   ล้างค่าทั้งหมดในแผงควบคุมและพื้นที่จำลองกลับสู่ค่าเริ่มต้น
   --------------------------------------------------------- */
function resetExperiment() {
  labState = {
    reactionType: "",
    reactant: "",
    reagent: "",
    toggles: { uv: false, heat: false, catalyst: false, acid: false },
    o2Level: 8,
    reactantAmount: 5,
    reagentAmount: 5,
    temperature: 25,
    time: 1,
    hasDropped: false
  };
  currentExperimentResult = null;

  // รีเซ็ตฟอร์มควบคุม
  document.getElementById("select-reaction-type").value = "";
  document.getElementById("select-reactant").value = "";
  document.getElementById("select-reagent").value = "";
  document.getElementById("slider-o2").value = 8;
  document.getElementById("slider-reactant-amount").value = 5;
  document.getElementById("slider-reagent-amount").value = 5;
  document.getElementById("slider-temp").value = 25;
  document.getElementById("slider-time").value = 1;

  document.querySelectorAll(".toggle-btn").forEach(btn => btn.classList.remove("toggle-btn--active"));
  document.getElementById("btn-heat").classList.remove("sim-btn--active");
  document.getElementById("btn-uv").classList.remove("sim-btn--active");
  document.getElementById("heat-source").classList.remove("heat-source--on");
  document.getElementById("uv-beam").classList.remove("uv-beam--on");

  syncControlReadouts();
  playReactionAnimation(null, null);

  document.getElementById("result-empty-state").style.display = "block";
  document.getElementById("result-content").style.display = "none";
}

/* ---------------------------------------------------------
   ผูก event ของห้องทดลองทั้งหมด
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

  const reactionTypeSelect = document.getElementById("select-reaction-type");
  const reactantSelect = document.getElementById("select-reactant");
  const reagentSelect = document.getElementById("select-reagent");

  if (reactionTypeSelect) {
    reactionTypeSelect.addEventListener("change", (e) => {
      labState.reactionType = e.target.value;
    });
  }

  if (reactantSelect) {
    reactantSelect.addEventListener("change", (e) => {
      labState.reactant = e.target.value;
      syncControlReadouts();
    });
  }

  if (reagentSelect) {
    reagentSelect.addEventListener("change", (e) => {
      labState.reagent = e.target.value;
      syncControlReadouts();
    });
  }

  // ปุ่ม toggle เงื่อนไข (UV / heat / catalyst / acid)
  document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.toggle;
      labState.toggles[key] = !labState.toggles[key];
      btn.classList.toggle("toggle-btn--active", labState.toggles[key]);

      // เชื่อมกับปุ่มจำลองในพื้นที่ทดลอง (heat / uv) ให้สถานะตรงกัน
      if (key === "heat") {
        document.getElementById("btn-heat").classList.toggle("sim-btn--active", labState.toggles.heat);
        document.getElementById("heat-source").classList.toggle("heat-source--on", labState.toggles.heat);
      }
      if (key === "uv") {
        document.getElementById("btn-uv").classList.toggle("sim-btn--active", labState.toggles.uv);
        document.getElementById("uv-beam").classList.toggle("uv-beam--on", labState.toggles.uv);
      }
    });
  });

  // sliders
  const sliderMap = [
    ["slider-o2", "o2Level"],
    ["slider-reactant-amount", "reactantAmount"],
    ["slider-reagent-amount", "reagentAmount"],
    ["slider-temp", "temperature"],
    ["slider-time", "time"]
  ];
  sliderMap.forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", (e) => {
        labState[key] = Number(e.target.value);
        syncControlReadouts();
      });
    }
  });

  // ปุ่มจำลองในพื้นที่ทดลอง
  const btnDrop = document.getElementById("btn-drop");
  const btnHeat = document.getElementById("btn-heat");
  const btnUv = document.getElementById("btn-uv");
  const btnReact = document.getElementById("btn-react");
  const btnReset = document.getElementById("btn-reset");

  if (btnDrop) {
    btnDrop.addEventListener("click", () => {
      if (!labState.reactant || !labState.reagent) {
        alert("กรุณาเลือกสารอินทรีย์และรีเอเจนต์ก่อนหยดสาร");
        return;
      }
      labState.hasDropped = true;
      btnDrop.classList.add("sim-btn--active");
      const liquid = document.getElementById("testtube-liquid");
      liquid.style.height = "35%";
    });
  }

  if (btnHeat) {
    btnHeat.addEventListener("click", () => {
      labState.toggles.heat = !labState.toggles.heat;
      btnHeat.classList.toggle("sim-btn--active", labState.toggles.heat);
      document.getElementById("heat-source").classList.toggle("heat-source--on", labState.toggles.heat);
      document.getElementById("toggle-heat").classList.toggle("toggle-btn--active", labState.toggles.heat);
    });
  }

  if (btnUv) {
    btnUv.addEventListener("click", () => {
      labState.toggles.uv = !labState.toggles.uv;
      btnUv.classList.toggle("sim-btn--active", labState.toggles.uv);
      document.getElementById("uv-beam").classList.toggle("uv-beam--on", labState.toggles.uv);
      document.getElementById("toggle-uv").classList.toggle("toggle-btn--active", labState.toggles.uv);
    });
  }

  if (btnReact) {
    btnReact.addEventListener("click", startExperiment);
  }

  if (btnReset) {
    btnReset.addEventListener("click", resetExperiment);
  }

  syncControlReadouts();
});


/* =========================================================
   เฟส 4: สำรวจสมการและผลิตภัณฑ์
   ---------------------------------------------------------
   eqViewState เก็บค่าการตั้งค่าการแสดงผลของหน้านี้
   ========================================================= */

let eqViewState = {
  selectedId: "",
  show: { name: true, formula: true, structure: false, highlight: false },
  view: "before" // "before" | "after" | "compare"
};

/* ---------------------------------------------------------
   buildSimpleStructure(formula)
   แปลงสูตรเคมีให้เป็น HTML ที่มีสีอะตอมตามธาตุ (ไม่ใช้ library)
   รองรับธาตุ C, H, O, Cl, Br, N (ครอบคลุมสารทั้งหมดใน database)
   --------------------------------------------------------- */
function buildSimpleStructure(formula) {
  if (!formula) return "";

  // โทเค็นไนซ์: จับคู่ "ธาตุ(สองตัวอักษรก่อน) + ตัวเลข" หรือสัญลักษณ์อื่น ๆ
  const tokens = formula.match(/(Cl|Br|[A-Z][a-z]?|\d+|[^A-Za-z0-9])/g) || [];
  let html = "";

  tokens.forEach(tok => {
    if (/^(C|H|O|N|Cl|Br)$/.test(tok)) {
      html += `<span class="atom-${tok}">${tok}</span>`;
    } else if (/^\d+$/.test(tok)) {
      html += `<sub>${tok}</sub>`;
    } else if (tok === "=") {
      html += `<span class="atom-bond-changed">=</span>`;
    } else {
      html += tok
        .replace(/->|=>/, "→")
        .replace(/<=>|<->/, "⇌");
    }
  });

  return html;
}

/* เติม dropdown เลือกปฏิกิริยาในหน้าสำรวจสมการ ด้วยรายการจาก reactionDatabase ทั้งหมด */
function populateEquationSelect() {
  const select = document.getElementById("select-eq-reaction");
  if (!select) return;

  reactionDatabase.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r.id;
    opt.textContent = `[${r.reactionType}] ${r.reactant} + ${r.reagent} → ${r.product}`;
    select.appendChild(opt);
  });
}

/* แสดงผลปฏิกิริยาที่เลือกในหน้าสำรวจสมการ ตามค่าทั้งหมดใน eqViewState */
function renderEquationExplorer() {
  const emptyState = document.getElementById("eq-empty-state");
  const content = document.getElementById("eq-content");

  if (!eqViewState.selectedId) {
    emptyState.style.display = "block";
    content.style.display = "none";
    return;
  }

  const r = reactionDatabase.find(x => x.id === eqViewState.selectedId);
  if (!r) return;

  emptyState.style.display = "none";
  content.style.display = "block";

  // แยกสารตั้งต้น/ผลิตภัณฑ์จาก equation string เพื่อแสดงในการ์ดก่อน-หลัง
  const [leftSide, rightSide] = r.equation.split(/->|<=>/).map(s => s.trim());

  const beforeNameEl = document.getElementById("eq-before-name");
  const beforeFormulaEl = document.getElementById("eq-before-formula");
  const beforeStructureEl = document.getElementById("eq-before-structure");
  const afterNameEl = document.getElementById("eq-after-name");
  const afterFormulaEl = document.getElementById("eq-after-formula");
  const afterStructureEl = document.getElementById("eq-after-structure");

  beforeNameEl.textContent = `${r.reactant} + ${r.reagent}`;
  setFormulaHTML(beforeFormulaEl, leftSide);
  beforeStructureEl.innerHTML = buildSimpleStructure(leftSide);

  afterNameEl.textContent = r.product;
  setFormulaHTML(afterFormulaEl, rightSide);
  afterStructureEl.innerHTML = buildSimpleStructure(rightSide);

  // โชว์/ซ่อนแต่ละองค์ประกอบตาม toggle ที่เปิดอยู่
  [beforeNameEl, afterNameEl].forEach(el => el.style.display = eqViewState.show.name ? "block" : "none");
  [beforeFormulaEl, afterFormulaEl].forEach(el => el.style.display = eqViewState.show.formula ? "block" : "none");
  [beforeStructureEl, afterStructureEl].forEach(el => el.style.display = eqViewState.show.structure ? "block" : "none");

  // โหมดการแสดงผล: ก่อน / หลัง / เปรียบเทียบ
  const beforeCard = document.getElementById("eq-card-before");
  const afterCard = document.getElementById("eq-card-after");
  if (eqViewState.view === "before") {
    beforeCard.classList.remove("eq-card--hidden");
    afterCard.classList.add("eq-card--hidden");
  } else if (eqViewState.view === "after") {
    beforeCard.classList.add("eq-card--hidden");
    afterCard.classList.remove("eq-card--hidden");
  } else {
    beforeCard.classList.remove("eq-card--hidden");
    afterCard.classList.remove("eq-card--hidden");
  }

  document.getElementById("eq-word-equation").textContent = r.wordEquation;
  setFormulaHTML(document.getElementById("eq-chem-equation"), r.equation);

  const highlightRow = document.getElementById("eq-highlight-text");
  if (eqViewState.show.highlight) {
    highlightRow.style.display = "block";
    document.getElementById("eq-highlight-detail").textContent = r.explanation;
  } else {
    highlightRow.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  populateEquationSelect();

  const eqSelect = document.getElementById("select-eq-reaction");
  if (eqSelect) {
    eqSelect.addEventListener("change", (e) => {
      eqViewState.selectedId = e.target.value;
      renderEquationExplorer();
    });
  }

  document.querySelectorAll(".eq-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.eqToggle;
      eqViewState.show[key] = !eqViewState.show[key];
      btn.classList.toggle("toggle-btn--active", eqViewState.show[key]);
      renderEquationExplorer();
    });
  });

  document.querySelectorAll(".eq-view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      eqViewState.view = btn.dataset.eqView;
      document.querySelectorAll(".eq-view-btn").forEach(b =>
        b.classList.toggle("eq-view-btn--active", b === btn)
      );
      renderEquationExplorer();
    });
  });

  // ตั้งค่าเริ่มต้น: เปิด toggle ชื่อสารและสูตรเคมีไว้ก่อน
  document.getElementById("eq-toggle-name").classList.add("toggle-btn--active");
  document.getElementById("eq-toggle-formula").classList.add("toggle-btn--active");
});


/* =========================================================
   เฟส 4: ตารางสังเกตผล
   ---------------------------------------------------------
   experimentLog เก็บรายการผลการทดลองที่บันทึกไว้ทั้งหมด
   บันทึก/โหลดจาก localStorage คีย์ "organicLab_table"
   ========================================================= */

const STORAGE_KEY_TABLE = "organicLab_table";
let experimentLog = [];

function loadExperimentLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TABLE);
    if (raw) experimentLog = JSON.parse(raw);
  } catch (e) {
    console.warn("ไม่สามารถโหลดตารางผลการทดลองเดิมได้", e);
    experimentLog = [];
  }
}

function saveExperimentLogToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY_TABLE, JSON.stringify(experimentLog));
  } catch (e) {
    console.warn("ไม่สามารถบันทึกตารางผลการทดลองได้", e);
  }
}

/* ---------------------------------------------------------
   saveExperimentToTable()
   นำผลการทดลองล่าสุด (currentExperimentResult จากเฟส 3) มาเพิ่มในตาราง
   บันทึกได้เฉพาะกรณีที่เกิดปฏิกิริยาจริง (match === "exact")
   --------------------------------------------------------- */
function saveExperimentToTable() {
  if (!currentExperimentResult || currentExperimentResult.matchType !== "exact") {
    alert("กรุณาทำการทดลองที่เกิดปฏิกิริยาจริงในห้องทดลองก่อน แล้วจึงกดบันทึกลงตาราง");
    return;
  }

  const r = currentExperimentResult.data;
  const summary = `${r.reactionType}: ${r.observation}`;

  experimentLog.push({
    order: experimentLog.length + 1,
    reactant: currentExperimentResult.reactant,
    reagent: currentExperimentResult.reagent,
    condition: currentExperimentResult.condition,
    observation: r.observation,
    equation: r.equation,
    reactionType: r.reactionType,
    product: r.product,
    summary: summary
  });

  saveExperimentLogToStorage();
  renderObservationTable();
  goToPage("page-table");
}

/* ล้างตารางทั้งหมด (ขอยืนยันก่อน) */
function clearObservationTable() {
  if (experimentLog.length === 0) return;
  const confirmed = confirm("ต้องการล้างข้อมูลในตารางทั้งหมดหรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้");
  if (!confirmed) return;
  experimentLog = [];
  saveExperimentLogToStorage();
  renderObservationTable();
}

/* วาดตารางใหม่จาก experimentLog */
function renderObservationTable() {
  const tbody = document.getElementById("obs-table-body");
  if (!tbody) return;

  if (experimentLog.length === 0) {
    tbody.innerHTML = `<tr id="obs-table-empty-row"><td colspan="10" class="obs-table-empty">ยังไม่มีข้อมูล — ไปที่ "ห้องทดลอง" แล้วกดบันทึกผลที่นี่</td></tr>`;
    return;
  }

  tbody.innerHTML = experimentLog.map((row, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${row.reactant}</td>
      <td>${renderFormula(row.reagent)}</td>
      <td>${row.condition}</td>
      <td>${row.observation}</td>
      <td class="formula">${renderFormula(row.equation)}</td>
      <td>${row.reactionType}</td>
      <td>${row.product}</td>
      <td>${row.summary}</td>
      <td><button type="button" class="row-delete-btn" data-row-index="${idx}" title="ลบแถวนี้">✕</button></td>
    </tr>
  `).join("");

  // ผูก event ลบรายแถว
  tbody.querySelectorAll(".row-delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.rowIndex);
      experimentLog.splice(idx, 1);
      experimentLog.forEach((r, i) => r.order = i + 1);
      saveExperimentLogToStorage();
      renderObservationTable();
    });
  });
}

/* แปลงตารางทั้งหมดเป็นข้อความล้วน (ใช้ทั้งคัดลอกและดาวน์โหลด) */
function buildTableAsText() {
  const header = ["ลำดับ","สารตั้งต้น","รีเอเจนต์","เงื่อนไข","สิ่งที่สังเกตได้","สมการเคมี","ชนิดปฏิกิริยา","ผลิตภัณฑ์","สรุปผล"];
  let lines = [header.join("\t")];
  experimentLog.forEach((row, idx) => {
    lines.push([
      idx + 1, row.reactant, row.reagent, row.condition,
      row.observation, row.equation, row.reactionType, row.product, row.summary
    ].join("\t"));
  });
  return lines.join("\n");
}

/* คัดลอกตารางไปยัง clipboard */
function copyTableToClipboard() {
  if (experimentLog.length === 0) {
    alert("ยังไม่มีข้อมูลในตารางให้คัดลอก");
    return;
  }
  const text = buildTableAsText();
  navigator.clipboard.writeText(text)
    .then(() => alert("คัดลอกตารางเรียบร้อยแล้ว นำไปวางในเอกสารหรือใบงานของคุณได้เลย"))
    .catch(() => alert("ไม่สามารถคัดลอกอัตโนมัติได้ กรุณาเลือกข้อความในตารางแล้วคัดลอกด้วยตนเอง"));
}

/* ดาวน์โหลดตารางเป็นไฟล์ .txt */
function downloadTableAsTxt() {
  if (experimentLog.length === 0) {
    alert("ยังไม่มีข้อมูลในตารางให้ดาวน์โหลด");
    return;
  }
  const text = buildTableAsText();
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ผลการทดลอง_${userState.name || "นักเรียน"}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* พิมพ์ตารางผลการทดลอง (ใช้ print dialog ของเบราว์เซอร์) */
function printObservationTable() {
  if (experimentLog.length === 0) {
    alert("ยังไม่มีข้อมูลในตารางให้พิมพ์");
    return;
  }
  window.print();
}

document.addEventListener("DOMContentLoaded", () => {
  loadExperimentLog();
  renderObservationTable();

  const btnSave = document.getElementById("btn-save-to-table");
  const btnClear = document.getElementById("btn-clear-table");
  const btnCopy = document.getElementById("btn-copy-table");
  const btnDownload = document.getElementById("btn-download-table");
  const btnPrint = document.getElementById("btn-print-table");

  if (btnSave) btnSave.addEventListener("click", saveExperimentToTable);
  if (btnClear) btnClear.addEventListener("click", clearObservationTable);
  if (btnCopy) btnCopy.addEventListener("click", copyTableToClipboard);
  if (btnDownload) btnDownload.addEventListener("click", downloadTableAsTxt);
  if (btnPrint) btnPrint.addEventListener("click", printObservationTable);
});


/* =========================================================
   เฟส 5: ภารกิจใบงาน Interactive (6 ฐาน)
   ========================================================= */

const missionDatabase = [
  {
    id: "mission1",
    title: "ฐานที่ 1: สังเกตสีโบรมีน",
    task: "ทดลอง ethene + Br2 และ ethane + Br2 ในห้องทดลอง แล้วเปรียบเทียบผลที่ได้",
    presetLab: { reactant: "ethene", reagent: "Br2", toggles: {} },
    questions: [
      { id: "q1", text: "สารใดทำให้สี Br2 จางลง", hint: "ลองทดลองทั้งสองสารแล้วเปรียบเทียบสีที่จางลง", keywords: ["ethene"] },
      { id: "q2", text: "เพราะเหตุใดจึงเป็นเช่นนั้น", hint: "พิจารณาว่าสารใดมีพันธะคู่ C=C", keywords: ["พันธะคู่", "c=c", "ไม่อิ่มตัว"] },
      { id: "q3", text: "ปฏิกิริยาที่เกิดขึ้นคือชนิดใด", hint: "พันธะคู่เปิดออกรับอะตอมใหม่เข้ามา", keywords: ["การเติม", "addition"] }
    ]
  },
  {
    id: "mission2",
    title: "ฐานที่ 2: แสง UV กับปฏิกิริยาแทนที่",
    task: "ทดลอง methane + Cl2 โดยเลือกและไม่เลือกเงื่อนไขแสง UV เปรียบเทียบผล",
    presetLab: { reactant: "methane", reagent: "Cl2", toggles: { uv: true } },
    questions: [
      { id: "q1", text: "เมื่อไม่มี UV เกิดปฏิกิริยาหรือไม่", hint: "ลองปิด toggle UV แล้วกดเริ่มปฏิกิริยาดู", keywords: ["ไม่เกิด", "ช้า", "ไม่ชัดเจน"] },
      { id: "q2", text: "เมื่อมี UV ผลต่างกันอย่างไร", hint: "เปิด toggle UV แล้วลองสังเกตสถานะผลการทดลอง", keywords: ["เกิดปฏิกิริยา", "แทนที่", "เกิดผลิตภัณฑ์"] },
      { id: "q3", text: "ผลิตภัณฑ์คืออะไร", hint: "ดูสมการเคมีในแผงผลการทดลอง", keywords: ["chloromethane", "ch3cl", "hcl"] }
    ]
  },
  {
    id: "mission3",
    title: "ฐานที่ 3: การเผาไหม้สมบูรณ์และไม่สมบูรณ์",
    task: "ทดลอง propane + O2 โดยปรับระดับออกซิเจนให้เพียงพอและไม่เพียงพอ",
    presetLab: { reactant: "propane", reagent: "O2", toggles: { heat: true }, o2Level: 8 },
    questions: [
      { id: "q1", text: "เมื่อ O2 เพียงพอได้ผลิตภัณฑ์อะไร", hint: "ปรับ slider O2 ให้สูง (≥5) แล้วเริ่มปฏิกิริยา", keywords: ["co2", "h2o", "คาร์บอนไดออกไซด์", "น้ำ"] },
      { id: "q2", text: "เมื่อ O2 ไม่เพียงพอสังเกตเห็นอะไร", hint: "ปรับ slider O2 ให้ต่ำ (<5) แล้วเริ่มปฏิกิริยาใหม่", keywords: ["ควันดำ", "เขม่า", "co"] },
      { id: "q3", text: "เขม่าดำเกิดจากอะไร", hint: "พิจารณาว่าคาร์บอนถูกออกซิไดซ์ไม่ครบเมื่อ O2 ไม่พอ", keywords: ["คาร์บอน", "ออกซิเจนไม่พอ", "เผาไหม้ไม่สมบูรณ์"] }
    ]
  },
  {
    id: "mission4",
    title: "ฐานที่ 4: ออกซิเดชันของแอลกอฮอล์",
    task: "ทดลอง ethanol + KMnO4 และ propan-2-ol + KMnO4 เปรียบเทียบผลิตภัณฑ์ที่ได้",
    presetLab: { reactant: "ethanol", reagent: "KMnO4", toggles: { heat: true } },
    questions: [
      { id: "q1", text: "สีของ KMnO4 เปลี่ยนอย่างไร", hint: "สังเกตสีของเหลวในหลอดทดลองหลังเริ่มปฏิกิริยา", keywords: ["ม่วง", "จาง", "น้ำตาล"] },
      { id: "q2", text: "ผลิตภัณฑ์ของ ethanol คืออะไร", hint: "ดูในแผงผลการทดลองช่อง 'ผลิตภัณฑ์'", keywords: ["ethanoic acid", "กรด"] },
      { id: "q3", text: "แอลกอฮอล์ปฐมภูมิและทุติยภูมิต่างกันอย่างไร", hint: "ลองเปลี่ยนสารตั้งต้นเป็น propan-2-ol แล้วเปรียบเทียบผลิตภัณฑ์", keywords: ["กรด", "คีโตน", "ketone"] }
    ]
  },
  {
    id: "mission5",
    title: "ฐานที่ 5: สร้างเอสเตอร์",
    task: "ทดลอง ethanoic acid + ethanol โดยเลือกเงื่อนไขกรดเข้มข้นและความร้อน",
    presetLab: { reactant: "ethanoic acid", reagent: "ethanol", toggles: { acid: true, heat: true } },
    questions: [
      { id: "q1", text: "ผลิตภัณฑ์คืออะไร", hint: "ดูในแผงผลการทดลองช่อง 'ผลิตภัณฑ์'", keywords: ["ethyl ethanoate", "เอสเตอร์"] },
      { id: "q2", text: "สิ่งที่สังเกตได้คืออะไร", hint: "สังเกตไอคอนและคำอธิบายในพื้นที่จำลอง", keywords: ["กลิ่นหอม", "กลิ่น"] },
      { id: "q3", text: "ทำไมต้องใช้กรดเข้มข้นและความร้อน", hint: "ลองปิด toggle กรดหรือความร้อน แล้วดูว่าผลต่างกันอย่างไร", keywords: ["ตัวเร่ง", "เร่งปฏิกิริยา", "อัตรา"] }
    ]
  },
  {
    id: "mission6",
    title: "ฐานที่ 6: ย้อนกลับเอสเตอร์",
    task: "ทดลอง ethyl ethanoate + H2O และ ethyl ethanoate + NaOH เปรียบเทียบผลิตภัณฑ์",
    presetLab: { reactant: "ethyl ethanoate", reagent: "H2O", toggles: { acid: true, heat: true } },
    questions: [
      { id: "q1", text: "ไฮโดรลิซิสให้ผลิตภัณฑ์อะไร", hint: "ดูผลิตภัณฑ์จากปฏิกิริยา ethyl ethanoate + H2O", keywords: ["กรด", "แอลกอฮอล์", "ethanoic", "ethanol"] },
      { id: "q2", text: "ถ้าใช้ NaOH ผลิตภัณฑ์เปลี่ยนอย่างไร", hint: "ลองเปลี่ยนรีเอเจนต์เป็น NaOH แล้วเริ่มปฏิกิริยาใหม่", keywords: ["เกลือ", "sodium", "คาร์บอกซิเลต"] },
      { id: "q3", text: "ปฏิกิริยานี้สัมพันธ์กับเอสเทอริฟิเคชันอย่างไร", hint: "พิจารณาทิศทางลูกศรปฏิกิริยาเทียบกับฐานที่ 5", keywords: ["ย้อนกลับ", "ผันกลับ", "reverse"] }
    ]
  }
];

const STORAGE_KEY_MISSION = "organicLab_missions";
let missionProgress = {};

function loadMissionProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MISSION);
    if (raw) missionProgress = JSON.parse(raw);
  } catch (e) {
    console.warn("ไม่สามารถโหลดความคืบหน้าภารกิจได้", e);
    missionProgress = {};
  }
}

function saveMissionProgress() {
  try {
    localStorage.setItem(STORAGE_KEY_MISSION, JSON.stringify(missionProgress));
  } catch (e) {
    console.warn("ไม่สามารถบันทึกความคืบหน้าภารกิจได้", e);
  }
}

/* คืนค่าความคืบหน้าของภารกิจหนึ่ง (สร้างค่าเริ่มต้นถ้ายังไม่มี) */
function getMissionState(missionId) {
  if (!missionProgress[missionId]) {
    missionProgress[missionId] = { answers: {}, correct: {}, hintShown: {} };
  }
  return missionProgress[missionId];
}

/* ภารกิจหนึ่งจะถือว่า "ผ่านฐาน" เมื่อทุกคำถามถูกตรวจแล้วและตรงคำสำคัญอย่างน้อย 1 คำ */
function isMissionPassed(mission) {
  const state = getMissionState(mission.id);
  return mission.questions.every(q => state.correct[q.id] === true);
}

/* ---------------------------------------------------------
   openLabPreset(mission)
   เปิดห้องทดลองพร้อมตั้งค่าสาร/รีเอเจนต์/เงื่อนไขล่วงหน้าให้ตรงกับฐานนั้น
   --------------------------------------------------------- */
function openLabPreset(mission) {
  const preset = mission.presetLab;

  // ตั้งค่า state และ dropdown ในห้องทดลอง
  labState.reactant = preset.reactant;
  labState.reagent = preset.reagent;
  document.getElementById("select-reactant").value = preset.reactant;
  document.getElementById("select-reagent").value = preset.reagent;

  // รีเซ็ต toggle ทั้งหมดก่อนตั้งค่าตามฐาน
  Object.keys(labState.toggles).forEach(k => labState.toggles[k] = false);
  document.querySelectorAll(".toggle-btn").forEach(btn => btn.classList.remove("toggle-btn--active"));
  document.getElementById("btn-heat").classList.remove("sim-btn--active");
  document.getElementById("btn-uv").classList.remove("sim-btn--active");
  document.getElementById("heat-source").classList.remove("heat-source--on");
  document.getElementById("uv-beam").classList.remove("uv-beam--on");

  Object.entries(preset.toggles || {}).forEach(([key, val]) => {
    labState.toggles[key] = val;
    const ctrlBtn = document.getElementById(`toggle-${key}`);
    if (ctrlBtn) ctrlBtn.classList.toggle("toggle-btn--active", val);
    if (key === "heat") {
      document.getElementById("btn-heat").classList.toggle("sim-btn--active", val);
      document.getElementById("heat-source").classList.toggle("heat-source--on", val);
    }
    if (key === "uv") {
      document.getElementById("btn-uv").classList.toggle("sim-btn--active", val);
      document.getElementById("uv-beam").classList.toggle("uv-beam--on", val);
    }
  });

  if (preset.o2Level !== undefined) {
    labState.o2Level = preset.o2Level;
    document.getElementById("slider-o2").value = preset.o2Level;
  }

  syncControlReadouts();
  playReactionAnimation(null, null);
  document.getElementById("result-empty-state").style.display = "block";
  document.getElementById("result-content").style.display = "none";

  goToPage("page-lab");
}

/* ---------------------------------------------------------
   checkWorksheetAnswer(missionId, questionId)
   ตรวจคำตอบเบื้องต้นแบบ keyword matching (ไม่ตัดสินถูก/ผิดตายตัว
   แต่ช่วยชี้แนะแนวทาง) แล้วบันทึกผลลง missionProgress
   --------------------------------------------------------- */
function checkWorksheetAnswer(missionId, questionId) {
  const mission = missionDatabase.find(m => m.id === missionId);
  const question = mission.questions.find(q => q.id === questionId);
  const textarea = document.getElementById(`mq-input-${missionId}-${questionId}`);
  const feedbackEl = document.getElementById(`mq-feedback-${missionId}-${questionId}`);

  const answerText = textarea.value.trim();
  if (!answerText) {
    alert("กรุณาพิมพ์คำตอบก่อนตรวจคำตอบ");
    return;
  }

  const lower = answerText.toLowerCase();
  const isCorrect = question.keywords.some(kw => lower.includes(kw.toLowerCase()));

  const state = getMissionState(missionId);
  state.answers[questionId] = answerText;
  state.correct[questionId] = isCorrect;
  saveMissionProgress();

  feedbackEl.classList.remove("mission-question__feedback--correct", "mission-question__feedback--hint");
  if (isCorrect) {
    feedbackEl.classList.add("mission-question__feedback--correct");
    feedbackEl.textContent = "✅ ดีมาก แนวคำตอบของคุณตรงประเด็น อย่าลืมเขียนคำตอบนี้ลงในใบงานของคุณด้วย";
  } else {
    feedbackEl.classList.add("mission-question__feedback--hint");
    feedbackEl.textContent = "🟡 ลองทบทวนอีกครั้ง กดปุ่ม 'ดูคำใบ้' เพื่อช่วยคิด แล้วลองตอบใหม่";
  }

  renderMissions(); // อัปเดตสถานะผ่านฐานของการ์ดทั้งหมด
}

/* แสดง/ซ่อนคำใบ้ของคำถามหนึ่งข้อ */
function showHint(missionId, questionId) {
  const hintEl = document.getElementById(`mq-hint-${missionId}-${questionId}`);
  if (hintEl) hintEl.classList.toggle("mission-question__hint-text--shown");
}

/* ---------------------------------------------------------
   renderMissions()
   วาดการ์ดภารกิจทั้ง 6 ฐานลงใน #mission-list
   --------------------------------------------------------- */
function renderMissions() {
  const container = document.getElementById("mission-list");
  if (!container) return;

  // เก็บว่าฐานไหนเปิดอยู่ ก่อน re-render เพื่อไม่ให้ปิดเองตอน re-render
  const openIds = [...container.querySelectorAll(".mission-card__body--open")]
    .map(el => el.closest(".mission-card").dataset.missionId);

  container.innerHTML = missionDatabase.map(mission => {
    const passed = isMissionPassed(mission);
    const state = getMissionState(mission.id);
    const isOpen = openIds.includes(mission.id);

    const questionsHTML = mission.questions.map(q => {
      const savedAnswer = state.answers[q.id] || "";
      const isCorrect = state.correct[q.id];
      let feedbackClass = "";
      let feedbackText = "";
      if (isCorrect === true) {
        feedbackClass = "mission-question__feedback--correct";
        feedbackText = "✅ ดีมาก แนวคำตอบของคุณตรงประเด็น อย่าลืมเขียนคำตอบนี้ลงในใบงานของคุณด้วย";
      } else if (isCorrect === false) {
        feedbackClass = "mission-question__feedback--hint";
        feedbackText = "🟡 ลองทบทวนอีกครั้ง กดปุ่ม 'ดูคำใบ้' เพื่อช่วยคิด แล้วลองตอบใหม่";
      }

      return `
        <div class="mission-question">
          <div class="mission-question__text">${q.text}</div>
          <textarea id="mq-input-${mission.id}-${q.id}" placeholder="พิมพ์แนวคำตอบของคุณที่นี่...">${savedAnswer}</textarea>
          <div class="mission-question__actions">
            <button type="button" class="sim-btn" onclick="checkWorksheetAnswer('${mission.id}','${q.id}')">ตรวจคำตอบ</button>
            <button type="button" class="sim-btn sim-btn--ghost" onclick="showHint('${mission.id}','${q.id}')">💡 ดูคำใบ้</button>
          </div>
          <div id="mq-hint-${mission.id}-${q.id}" class="mission-question__hint-text">คำใบ้: ${q.hint}</div>
          <div id="mq-feedback-${mission.id}-${q.id}" class="mission-question__feedback ${feedbackClass}">${feedbackText}</div>
        </div>
      `;
    }).join("");

    return `
      <div class="mission-card" data-mission-id="${mission.id}">
        <div class="mission-card__head" onclick="toggleMissionCard('${mission.id}')">
          <span class="mission-card__title">${mission.title}</span>
          <span class="mission-card__status ${passed ? "mission-card__status--passed" : ""}">
            ${passed ? "✅ ผ่านฐานแล้ว" : "⏳ ยังไม่ผ่าน"}
          </span>
        </div>
        <div class="mission-card__body ${isOpen ? "mission-card__body--open" : ""}">
          <div class="mission-card__task">🎯 ${mission.task}</div>
          <button type="button" class="sim-btn sim-btn--primary mission-open-lab-btn" onclick='openLabPreset(missionDatabase.find(m => m.id === "${mission.id}"))'>
            🔬 เปิดห้องทดลองของฐานนี้
          </button>
          ${questionsHTML}
        </div>
      </div>
    `;
  }).join("");
}

/* เปิด/ปิดการ์ดภารกิจ (accordion) */
function toggleMissionCard(missionId) {
  const card = document.querySelector(`.mission-card[data-mission-id="${missionId}"]`);
  if (!card) return;
  const body = card.querySelector(".mission-card__body");
  body.classList.toggle("mission-card__body--open");
}

document.addEventListener("DOMContentLoaded", () => {
  loadMissionProgress();
  renderMissions();
});


/* =========================================================
   เฟส 6: แบบทดสอบสรุป (15 ข้อ) + ระบบคะแนน 3 ส่วน
   ---------------------------------------------------------
   topic ของแต่ละข้อ ใช้จับคู่กับ reviewTopicMap เพื่อแนะนำ
   หัวข้อที่ควรทบทวนเมื่อตอบผิด
   ========================================================= */

const quizDatabase = [
  {
    id: "quiz1",
    question: "เมื่อหยด Br2 ลงใน ethene แล้วสีจางลง แสดงว่าเกิดปฏิกิริยาใด",
    options: ["การแทนที่", "การเติม", "การเผาไหม้", "ออกซิเดชัน"],
    correctIndex: 1,
    explanation: "Br2 ทำปฏิกิริยากับพันธะคู่ C=C ของ ethene โดยการเติม (addition) ทำให้สีจางลง",
    topic: "addition"
  },
  {
    id: "quiz2",
    question: "methane ทำปฏิกิริยากับ Cl2 ได้ดีขึ้นเมื่อมีเงื่อนไขใด",
    options: ["ความร้อนเท่านั้น", "แสง UV", "ตัวเร่งปฏิกิริยาโลหะ", "ไม่ต้องมีเงื่อนไขใด ๆ"],
    correctIndex: 1,
    explanation: "ปฏิกิริยาการแทนที่ของแอลเคนกับฮาโลเจนต้องใช้แสง UV เพื่อให้ Cl2 แตกตัวเป็นอนุมูลอิสระ",
    topic: "substitution"
  },
  {
    id: "quiz3",
    question: "ethanol ถูกออกซิไดซ์ด้วย KMnO4 ได้ผลิตภัณฑ์ใด",
    options: ["propanone", "ethanoic acid", "ethyl ethanoate", "ethene"],
    correctIndex: 1,
    explanation: "ethanol เป็นแอลกอฮอล์ปฐมภูมิ ถูกออกซิไดซ์ได้กรดคาร์บอกซิลิก คือ ethanoic acid",
    topic: "oxidation"
  },
  {
    id: "quiz4",
    question: "ethanoic acid + ethanol ได้ผลิตภัณฑ์หลักคืออะไร",
    options: ["ethyl ethanoate", "methanoic acid", "propanone", "chloroethane"],
    correctIndex: 0,
    explanation: "ปฏิกิริยาเอสเทอริฟิเคชันระหว่างกรดคาร์บอกซิลิกกับแอลกอฮอล์ ให้เอสเตอร์เป็นผลิตภัณฑ์หลัก",
    topic: "esterification"
  },
  {
    id: "quiz5",
    question: "การเผาไหม้ไม่สมบูรณ์สังเกตได้จากอะไร",
    options: ["เปลวไฟสีน้ำเงินใส", "ไม่มีการเปลี่ยนแปลงใด ๆ", "ควันดำหรือเขม่า", "สีของ Br2 จางลง"],
    correctIndex: 2,
    explanation: "เมื่อออกซิเจนไม่เพียงพอ การเผาไหม้จะไม่สมบูรณ์ เกิดควันดำหรือเขม่าคาร์บอนปนกับ CO",
    topic: "combustion"
  },
  {
    id: "quiz6",
    question: "สารใดทำให้ Br2 จางลงได้ดีที่สุด",
    options: ["methane", "ethane", "ethene", "propane"],
    correctIndex: 2,
    explanation: "ethene มีพันธะคู่ C=C จึงทำปฏิกิริยาการเติมกับ Br2 ได้ทันที ต่างจากแอลเคนที่ไม่มีพันธะคู่",
    topic: "addition"
  },
  {
    id: "quiz7",
    question: "propan-2-ol เมื่อถูกออกซิไดซ์จะได้ผลิตภัณฑ์ชนิดใด",
    options: ["กรดคาร์บอกซิลิก", "คีโตน (propanone)", "เอสเตอร์", "แอลคีน"],
    correctIndex: 1,
    explanation: "propan-2-ol เป็นแอลกอฮอล์ทุติยภูมิ เมื่อถูกออกซิไดซ์จะได้คีโตน ไม่ใช่กรด",
    topic: "oxidation"
  },
  {
    id: "quiz8",
    question: "ไฮโดรลิซิสของเอสเตอร์ในกรดให้ผลิตภัณฑ์ใด",
    options: ["เกลือคาร์บอกซิเลตเท่านั้น", "กรดคาร์บอกซิลิกและแอลกอฮอล์", "แอลคีนและน้ำ", "ฮาโลแอลเคน"],
    correctIndex: 1,
    explanation: "ไฮโดรลิซิสของเอสเตอร์ด้วยน้ำและกรดเป็นตัวเร่ง ให้กรดคาร์บอกซิลิกและแอลกอฮอล์กลับคืนมา",
    topic: "hydrolysis"
  },
  {
    id: "quiz9",
    question: "ปฏิกิริยาใดต้องใช้กรดเข้มข้นและความร้อนเป็นเงื่อนไขสำคัญ",
    options: ["การเติม H2", "การแทนที่ด้วย Cl2", "เอสเทอริฟิเคชัน", "การเผาไหม้สมบูรณ์"],
    correctIndex: 2,
    explanation: "เอสเทอริฟิเคชันระหว่างกรดคาร์บอกซิลิกกับแอลกอฮอล์ต้องใช้กรดเข้มข้นเป็นตัวเร่งและให้ความร้อน",
    topic: "esterification"
  },
  {
    id: "quiz10",
    question: "การเติม H2 ให้แอลคีนเรียกว่าอะไร",
    options: ["Hydrogenation", "Hydrolysis", "Halogenation", "Oxidation"],
    correctIndex: 0,
    explanation: "การเติมแก๊ส H2 ให้กับพันธะคู่ของแอลคีนโดยมีตัวเร่งปฏิกิริยา เรียกว่า hydrogenation",
    topic: "addition"
  },
  {
    id: "quiz11",
    question: "เมื่อ methane ทำปฏิกิริยากับ Cl2 โดยไม่มีแสง UV จะเป็นอย่างไร",
    options: ["เกิดปฏิกิริยาทันทีเหมือนมี UV", "เกิดช้ามากหรือไม่ชัดเจน", "เกิดการเผาไหม้แทน", "เกิดเป็นเอสเตอร์"],
    correctIndex: 1,
    explanation: "หากไม่มีแสง UV กระตุ้นให้ Cl2 แตกตัวเป็นอนุมูลอิสระ ปฏิกิริยาการแทนที่จะเกิดช้ามากหรือไม่ชัดเจน",
    topic: "substitution"
  },
  {
    id: "quiz12",
    question: "ถ้าใช้ Br2 ปริมาณมากเกินพอกับ ethyne ผลิตภัณฑ์สุดท้ายคือสารใด",
    options: ["1,2-dibromoethene เท่านั้น", "สารประกอบเตตระโบรโม (พันธะเดี่ยวทั้งหมด)", "ethane", "ไม่เกิดปฏิกิริยา"],
    correctIndex: 1,
    explanation: "พันธะสามของ ethyne รับ Br2 ได้ถึง 2 โมเลกุลจนกลายเป็นพันธะเดี่ยวทั้งหมด หากมี Br2 มากเกินพอ",
    topic: "addition"
  },
  {
    id: "quiz13",
    question: "K2Cr2O7 เปลี่ยนสีอย่างไรเมื่อออกซิไดซ์แอลกอฮอล์",
    options: ["ม่วงเป็นน้ำตาล", "ส้มเป็นเขียว", "เขียวเป็นม่วง", "ไม่เปลี่ยนสี"],
    correctIndex: 1,
    explanation: "K2Cr2O7 มีสีส้ม เมื่อทำหน้าที่เป็นตัวออกซิไดซ์แอลกอฮอล์ จะเปลี่ยนเป็นสีเขียว",
    topic: "oxidation"
  },
  {
    id: "quiz14",
    question: "ethyl ethanoate ทำปฏิกิริยากับ NaOH ได้ผลิตภัณฑ์ใด",
    options: ["ethanoic acid และ ethanol", "sodium ethanoate และ ethanol", "ethene และน้ำ", "ไม่เกิดปฏิกิริยา"],
    correctIndex: 1,
    explanation: "ไฮโดรลิซิสของเอสเตอร์ในเบส (NaOH) ให้เกลือคาร์บอกซิเลต (sodium ethanoate) และแอลกอฮอล์",
    topic: "hydrolysis"
  },
  {
    id: "quiz15",
    question: "การเผาไหม้สมบูรณ์ของไฮโดรคาร์บอนให้ผลิตภัณฑ์ใด",
    options: ["CO และ เขม่าคาร์บอน", "CO2 และ H2O", "ฮาโลแอลเคนและ HCl", "เอสเตอร์และน้ำ"],
    correctIndex: 1,
    explanation: "เมื่อมีออกซิเจนเพียงพอ ไฮโดรคาร์บอนเผาไหม้สมบูรณ์ได้ CO2 และ H2O เท่านั้น",
    topic: "combustion"
  }
];

/* แผนที่หัวข้อ -> ป้ายชื่อภาษาไทย และคำแนะนำให้ทบทวน (ใช้หลังตรวจแบบทดสอบ) */
const reviewTopicMap = {
  substitution: { label: "ปฏิกิริยาการแทนที่", advice: "ทบทวนเรื่องการแทนที่ของแอลเคนกับฮาโลเจน โดยเฉพาะบทบาทของแสง UV" },
  addition: { label: "ปฏิกิริยาการเติม", advice: "ทบทวนเรื่องการเติมของแอลคีน/แอลไคน์ กับ Br2, H2, HCl และพันธะไม่อิ่มตัว" },
  combustion: { label: "การเผาไหม้", advice: "ทบทวนความแตกต่างระหว่างการเผาไหม้สมบูรณ์และไม่สมบูรณ์" },
  oxidation: { label: "ออกซิเดชันของแอลกอฮอล์", advice: "ทบทวนผลิตภัณฑ์จากออกซิเดชันของแอลกอฮอล์ปฐมภูมิและทุติยภูมิ" },
  esterification: { label: "เอสเทอริฟิเคชัน", advice: "ทบทวนเงื่อนไขและกลไกของเอสเทอริฟิเคชัน" },
  hydrolysis: { label: "ไฮโดรลิซิส", advice: "ทบทวนไฮโดรลิซิสของเอสเตอร์ทั้งในกรดและเบส" }
};

const STORAGE_KEY_QUIZ = "organicLab_quiz";
let quizState = { answers: {}, submitted: false, score: null };

function loadQuizState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUIZ);
    if (raw) quizState = JSON.parse(raw);
  } catch (e) {
    console.warn("ไม่สามารถโหลดผลแบบทดสอบเดิมได้", e);
  }
}

function saveQuizState() {
  try {
    localStorage.setItem(STORAGE_KEY_QUIZ, JSON.stringify(quizState));
  } catch (e) {
    console.warn("ไม่สามารถบันทึกผลแบบทดสอบได้", e);
  }
}

/* วาดรายการคำถามแบบทดสอบทั้งหมด */
function renderQuiz() {
  const container = document.getElementById("quiz-list");
  if (!container) return;

  container.innerHTML = quizDatabase.map((q, qIdx) => {
    const selected = quizState.answers[q.id];
    const isSubmitted = quizState.submitted;
    let itemClass = "quiz-item";
    if (isSubmitted) {
      itemClass += selected === q.correctIndex ? " quiz-item--correct" : " quiz-item--incorrect";
    }

    const optionsHTML = q.options.map((opt, optIdx) => {
      let optClass = "quiz-option";
      if (isSubmitted) {
        if (optIdx === q.correctIndex) optClass += " quiz-option--right-answer";
        else if (optIdx === selected) optClass += " quiz-option--wrong-answer";
      }
      return `
        <label class="${optClass}">
          <input type="radio" name="${q.id}" value="${optIdx}" ${selected === optIdx ? "checked" : ""} ${isSubmitted ? "disabled" : ""}>
          ${opt}
        </label>
      `;
    }).join("");

    return `
      <div class="${itemClass}" data-quiz-id="${q.id}">
        <div class="quiz-item__question">${qIdx + 1}. ${q.question}</div>
        <div class="quiz-item__options">${optionsHTML}</div>
        <div class="quiz-item__explanation ${isSubmitted ? "quiz-item__explanation--shown" : ""}">💡 ${q.explanation}</div>
      </div>
    `;
  }).join("");

  // ผูก event เลือกคำตอบ (เฉพาะตอนยังไม่ submit)
  if (!quizState.submitted) {
    container.querySelectorAll('input[type="radio"]').forEach(input => {
      input.addEventListener("change", (e) => {
        const quizId = e.target.name;
        quizState.answers[quizId] = Number(e.target.value);
        saveQuizState();
      });
    });
  }
}

/* ตรวจคำตอบทั้งหมด คำนวณคะแนน และวิเคราะห์หัวข้อที่ควรทบทวน */
function submitQuiz() {
  const unanswered = quizDatabase.filter(q => quizState.answers[q.id] === undefined);
  if (unanswered.length > 0) {
    const confirmed = confirm(`ยังตอบไม่ครบ ${unanswered.length} ข้อ ต้องการส่งคำตอบเลยหรือไม่?`);
    if (!confirmed) return;
  }

  let correctCount = 0;
  const wrongTopics = {};

  quizDatabase.forEach(q => {
    const selected = quizState.answers[q.id];
    if (selected === q.correctIndex) {
      correctCount++;
    } else {
      wrongTopics[q.topic] = (wrongTopics[q.topic] || 0) + 1;
    }
  });

  quizState.submitted = true;
  quizState.score = correctCount;
  saveQuizState();

  renderQuiz();
  renderScoreBoard();

  const summaryEl = document.getElementById("quiz-result-summary");
  summaryEl.style.display = "block";
  summaryEl.textContent = `🎯 คะแนนแบบทดสอบ: ${correctCount} / ${quizDatabase.length} ข้อ`;

  const suggestionEl = document.getElementById("quiz-review-suggestion");
  const topicEntries = Object.entries(wrongTopics).sort((a, b) => b[1] - a[1]);
  if (topicEntries.length > 0) {
    suggestionEl.style.display = "block";
    const items = topicEntries.map(([topic, count]) => {
      const t = reviewTopicMap[topic];
      return `<li><strong>${t.label}</strong> (ตอบผิด ${count} ข้อ) — ${t.advice}</li>`;
    }).join("");
    suggestionEl.innerHTML = `<strong>📚 หัวข้อที่ควรทบทวนเพิ่มเติม:</strong><ul>${items}</ul>`;
  } else {
    suggestionEl.style.display = "block";
    suggestionEl.innerHTML = "🌟 ยอดเยี่ยมมาก! ตอบถูกทุกข้อ ไม่มีหัวข้อที่ต้องทบทวนเพิ่มเติม";
  }
}

/* ทำแบบทดสอบใหม่ทั้งหมด */
function retryQuiz() {
  const confirmed = confirm("ต้องการล้างคำตอบและทำแบบทดสอบใหม่ทั้งหมดหรือไม่?");
  if (!confirmed) return;
  quizState = { answers: {}, submitted: false, score: null };
  saveQuizState();
  renderQuiz();
  renderScoreBoard();
  document.getElementById("quiz-result-summary").style.display = "none";
  document.getElementById("quiz-review-suggestion").style.display = "none";
}

/* ---------------------------------------------------------
   renderScoreBoard()
   คำนวณและแสดงคะแนน 3 ส่วน: ฐานที่ผ่าน / คำถามภารกิจที่ตอบถูก / แบบทดสอบ
   --------------------------------------------------------- */
function renderScoreBoard() {
  const missionEl = document.getElementById("score-mission");
  const worksheetEl = document.getElementById("score-worksheet");
  const quizEl = document.getElementById("score-quiz");
  if (!missionEl) return;

  const passedMissions = missionDatabase.filter(m => isMissionPassed(m)).length;
  missionEl.textContent = `${passedMissions} / ${missionDatabase.length} ฐาน`;

  let totalQuestions = 0;
  let correctQuestions = 0;
  missionDatabase.forEach(m => {
    const state = getMissionState(m.id);
    m.questions.forEach(q => {
      totalQuestions++;
      if (state.correct[q.id] === true) correctQuestions++;
    });
  });
  worksheetEl.textContent = `${correctQuestions} / ${totalQuestions} ข้อ`;

  quizEl.textContent = quizState.submitted
    ? `${quizState.score} / ${quizDatabase.length} ข้อ`
    : "ยังไม่ได้ทำ";
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuizState();
  renderQuiz();
  renderScoreBoard();

  const btnSubmitQuiz = document.getElementById("btn-submit-quiz");
  const btnRetryQuiz = document.getElementById("btn-retry-quiz");
  if (btnSubmitQuiz) btnSubmitQuiz.addEventListener("click", submitQuiz);
  if (btnRetryQuiz) btnRetryQuiz.addEventListener("click", retryQuiz);

  // อัปเดต scoreboard ทุกครั้งที่กลับมาหน้านี้ (เผื่อเพิ่งทำภารกิจมาใหม่)
  document.querySelectorAll('.nav-link[data-page="page-summary"]').forEach(btn => {
    btn.addEventListener("click", renderScoreBoard);
  });
});


/* =========================================================
   เฟส 7: ใบรายงานผลการทดลอง
   ---------------------------------------------------------
   reportNotes เก็บข้อความที่นักเรียนพิมพ์เอง (ข้อค้นพบ/ข้อสงสัย)
   บันทึกแยกจาก userState เพื่อให้แก้ไขได้อิสระ
   ========================================================= */

const STORAGE_KEY_REPORT_NOTES = "organicLab_reportNotes";
let reportNotes = { finding: "", question: "" };

function loadReportNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPORT_NOTES);
    if (raw) reportNotes = JSON.parse(raw);
  } catch (e) {
    console.warn("ไม่สามารถโหลดข้อความรายงานเดิมได้", e);
  }
}

function saveReportNotes() {
  try {
    localStorage.setItem(STORAGE_KEY_REPORT_NOTES, JSON.stringify(reportNotes));
  } catch (e) {
    console.warn("ไม่สามารถบันทึกข้อความรายงานได้", e);
  }
}

/* คืนรายชื่อหัวข้อ (ภาษาไทย) ที่นักเรียนเข้าใจดี และที่ควรทบทวน โดยอิงจากผลแบบทดสอบ */
function analyzeTopicUnderstanding() {
  if (!quizState.submitted) {
    return { good: "ยังไม่ได้ทำแบบทดสอบสรุป", review: "ยังไม่ได้ทำแบบทดสอบสรุป" };
  }

  const wrongTopics = new Set();
  const allTopics = new Set();
  quizDatabase.forEach(q => {
    allTopics.add(q.topic);
    if (quizState.answers[q.id] !== q.correctIndex) wrongTopics.add(q.topic);
  });

  const goodTopics = [...allTopics].filter(t => !wrongTopics.has(t));

  const goodLabel = goodTopics.length > 0
    ? goodTopics.map(t => reviewTopicMap[t].label).join(", ")
    : "ยังไม่มีหัวข้อที่ตอบถูกครบทุกข้อ";

  const reviewLabel = wrongTopics.size > 0
    ? [...wrongTopics].map(t => reviewTopicMap[t].label).join(", ")
    : "ไม่มี — ตอบถูกครบทุกหัวข้อ";

  return { good: goodLabel, review: reviewLabel };
}

/* ---------------------------------------------------------
   renderReportCard()
   เติมข้อมูลทั้งหมดลงในใบรายงานบนหน้าจอ (ส่วนหัว + ตาราง)
   --------------------------------------------------------- */
function renderReportCard() {
  const nameEl = document.getElementById("report-name");
  if (!nameEl) return; // ยังไม่อยู่ในหน้านี้

  document.getElementById("report-name").textContent = userState.name || "-";
  document.getElementById("report-class").textContent = userState.className || "-";
  document.getElementById("report-date").textContent = new Date().toLocaleDateString("th-TH", {
    year: "numeric", month: "long", day: "numeric"
  });
  document.getElementById("report-exp-count").textContent = `${experimentLog.length} ครั้ง`;

  const passedMissions = missionDatabase.filter(m => isMissionPassed(m)).length;
  document.getElementById("report-mission-passed").textContent = `${passedMissions} / ${missionDatabase.length} ฐาน`;

  let totalQ = 0, correctQ = 0;
  missionDatabase.forEach(m => {
    const state = getMissionState(m.id);
    m.questions.forEach(q => {
      totalQ++;
      if (state.correct[q.id] === true) correctQ++;
    });
  });
  document.getElementById("report-worksheet-score").textContent = `${correctQ} / ${totalQ} ข้อ`;
  document.getElementById("report-quiz-score").textContent = quizState.submitted
    ? `${quizState.score} / ${quizDatabase.length} ข้อ`
    : "ยังไม่ได้ทำ";

  const understanding = analyzeTopicUnderstanding();
  document.getElementById("report-good-topics").textContent = understanding.good;
  document.getElementById("report-review-topics").textContent = understanding.review;

  // เติม textarea จาก reportNotes ที่บันทึกไว้ (ถ้ายังไม่เคยพิมพ์ ให้เป็นค่าว่าง)
  const findingEl = document.getElementById("report-finding");
  const questionEl = document.getElementById("report-question");
  if (findingEl && findingEl.value === "") findingEl.value = reportNotes.finding;
  if (questionEl && questionEl.value === "") questionEl.value = reportNotes.question;

  // ตารางผลการทดลองทั้งหมด (ใช้ข้อมูลเดียวกับหน้าตารางสังเกตผล)
  const tbody = document.getElementById("report-table-body");
  if (experimentLog.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="obs-table-empty">ยังไม่มีข้อมูลการทดลอง</td></tr>`;
  } else {
    tbody.innerHTML = experimentLog.map((row, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${row.reactant}</td>
        <td>${renderFormula(row.reagent)}</td>
        <td>${row.condition}</td>
        <td>${row.observation}</td>
        <td class="formula">${renderFormula(row.equation)}</td>
        <td>${row.reactionType}</td>
        <td>${row.product}</td>
        <td>${row.summary}</td>
      </tr>
    `).join("");
  }
}

/* ---------------------------------------------------------
   generateReport()
   สร้างรายงานฉบับข้อความล้วนตามรูปแบบที่กำหนดในสเปก
   ใช้ทั้งดาวน์โหลด, คัดลอก
   --------------------------------------------------------- */
function generateReport() {
  const understanding = analyzeTopicUnderstanding();
  const dateStr = new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });

  const passedMissions = missionDatabase.filter(m => isMissionPassed(m)).length;
  let totalQ = 0, correctQ = 0;
  missionDatabase.forEach(m => {
    const state = getMissionState(m.id);
    m.questions.forEach(q => {
      totalQ++;
      if (state.correct[q.id] === true) correctQ++;
    });
  });

  const finding = document.getElementById("report-finding").value.trim() || "(ยังไม่ได้บันทึก)";
  const question = document.getElementById("report-question").value.trim() || "(ยังไม่ได้บันทึก)";

  const resultLines = experimentLog.length === 0
    ? "(ยังไม่มีข้อมูลการทดลอง)"
    : experimentLog.map((row, idx) =>
        `  ${idx + 1}. ${row.reactant} + ${row.reagent} (${row.condition}) -> ${row.product} | สังเกต: ${row.observation}`
      ).join("\n");

  return [
    "รายงานผลการทดลอง Interactive Lab",
    "เรื่อง ปฏิกิริยาเคมีของสารอินทรีย์",
    `ชื่อ-สกุล: ${userState.name || "-"}`,
    `ชั้น: ${userState.className || "-"}`,
    `วันที่: ${dateStr}`,
    "",
    `จำนวนการทดลองที่ทำ: ${experimentLog.length} ครั้ง`,
    `ฐานที่ผ่าน: ${passedMissions} / ${missionDatabase.length} ฐาน`,
    `คะแนนคำถามภารกิจ: ${correctQ} / ${totalQ} ข้อ`,
    `คะแนนแบบทดสอบสรุป: ${quizState.submitted ? quizState.score + " / " + quizDatabase.length + " ข้อ" : "ยังไม่ได้ทำ"}`,
    `ปฏิกิริยาที่เข้าใจดี: ${understanding.good}`,
    `ปฏิกิริยาที่ควรทบทวน: ${understanding.review}`,
    "",
    "ผลการทดลอง:",
    resultLines,
    "",
    "สรุปความรู้:",
    `  เรียนรู้เรื่องปฏิกิริยาเคมีของสารอินทรีย์ทั้ง 6 ประเภท ได้แก่ การแทนที่ การเติม การเผาไหม้ ออกซิเดชัน เอสเทอริฟิเคชัน และไฮโดรลิซิส`,
    "",
    "ข้อค้นพบจากการทดลอง:",
    `  ${finding}`,
    "",
    "ข้อสงสัยเพิ่มเติม:",
    `  ${question}`
  ].join("\n");
}

/* ดาวน์โหลดรายงานเป็นไฟล์ .txt */
function downloadReport() {
  saveCurrentReportNotes();
  const text = generateReport();
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `รายงานผลการทดลอง_${userState.name || "นักเรียน"}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* คัดลอกรายงานทั้งหมดไปยัง clipboard */
function copyReport() {
  saveCurrentReportNotes();
  const text = generateReport();
  navigator.clipboard.writeText(text)
    .then(() => alert("คัดลอกรายงานเรียบร้อยแล้ว นำไปวางในเอกสารหรือใบงานของคุณได้เลย"))
    .catch(() => alert("ไม่สามารถคัดลอกอัตโนมัติได้ กรุณาคัดลอกด้วยตนเอง"));
}

/* พิมพ์ใบรายงาน */
function printReport() {
  saveCurrentReportNotes();
  window.print();
}

/* บันทึกข้อความใน textarea ปัจจุบันลง reportNotes + localStorage */
function saveCurrentReportNotes() {
  reportNotes.finding = document.getElementById("report-finding").value.trim();
  reportNotes.question = document.getElementById("report-question").value.trim();
  saveReportNotes();
}

/* ---------------------------------------------------------
   resetAllData()
   ล้างข้อมูลทั้งหมดของแอพ (ผู้ใช้, ตาราง, ภารกิจ, แบบทดสอบ, รายงาน)
   แล้วโหลดหน้าใหม่กลับไปหน้าแรก
   --------------------------------------------------------- */
function resetAllData() {
  const confirmed = confirm("ต้องการรีเซ็ตข้อมูลทั้งหมดของแอพนี้หรือไม่? (ชื่อ, ตารางผล, ภารกิจ, แบบทดสอบ, รายงาน) การกระทำนี้ไม่สามารถย้อนกลับได้");
  if (!confirmed) return;

  [STORAGE_KEY_USER, STORAGE_KEY_TABLE, STORAGE_KEY_MISSION, STORAGE_KEY_QUIZ, STORAGE_KEY_REPORT_NOTES]
    .forEach(key => localStorage.removeItem(key));

  location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  loadReportNotes();
  renderReportCard();

  const btnDownloadReport = document.getElementById("btn-download-report");
  const btnCopyReport = document.getElementById("btn-copy-report");
  const btnPrintReport = document.getElementById("btn-print-report");
  const btnResetAll = document.getElementById("btn-reset-all");

  if (btnDownloadReport) btnDownloadReport.addEventListener("click", downloadReport);
  if (btnCopyReport) btnCopyReport.addEventListener("click", copyReport);
  if (btnPrintReport) btnPrintReport.addEventListener("click", printReport);
  if (btnResetAll) btnResetAll.addEventListener("click", resetAllData);

  // อัปเดตใบรายงานทุกครั้งที่กลับมาหน้าสรุปผล (ให้ข้อมูลล่าสุดเสมอ)
  document.querySelectorAll('.nav-link[data-page="page-summary"]').forEach(btn => {
    btn.addEventListener("click", renderReportCard);
  });

  // บันทึกข้อความอัตโนมัติเมื่อพิมพ์ในช่องข้อค้นพบ/ข้อสงสัย
  ["report-finding", "report-question"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", saveCurrentReportNotes);
  });
});
