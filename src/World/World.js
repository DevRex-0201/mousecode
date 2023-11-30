import { loadModel } from './components/model/model.js';
import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { Scene, BackSide, SkeletonHelper, MeshBasicMaterial, Group, SkinnedMesh, Skeleton, Vector3, Vector4, Matrix4, Matrix3 } from 'https://cdn.skypack.dev/three@v0.132.2';
import { OBJExporter } from 'https://cdn.skypack.dev/three@v0.132.2/examples/jsm/exporters/OBJExporter.js';
import { GLTFExporter } from 'https://cdn.skypack.dev/three@v0.132.2/examples/jsm/exporters/GLTFExporter.js';


let bonenames = [
  "c_pelvis01_jj_01",
  "c_tail03_jj_03",
  "c_tail04_jj_04",
  "c_tail05_jj_05",
  "c_tail06_jj_06",
  "c_tail07_jj_07",
  "c_tail08_jj_08",
  "c_tail09_jj_09",
  "c_tail10_jj_010",
  "c_tail11_jj_011",
  "c_tail12_jj_012",
  "c_tail13_jj_013",
  "c_tail14_jj_014",
  "c_tail15_jj_015",
  "c_tail16_jj_016",
  "c_tail17_jj_017",
  "c_tail18_jj_018",
  "c_tail19_jj_019",
  "c_tail20_jj_020",
  "c_tail21_jj_021",
  "c_tail22_jj_022",
  "c_tail23_jj_023",
  "c_spine01_jj_024",
  "c_spine02_jj_025",
  "organ_protect_L_2_099",
  "c_spine03_jj_026",
  "organ_protect_L_096",
  "organ_protect_S_097",
  "c_spine04_jj_027",
  "organ_protect_2_094",
  "c_spine05_jj_028",
  "c_neck01_jj_029",
  "c_head01_jj_030",
  "l_ear01_jj_033",
  "r_ear01_jj_036",
  "l_eye01_jj_039",
  "r_eye01_jj_040",
  "organ_protect_1_L_041",
  "organ_protect_1_R_042",
  "l_scapula01_jj_043",
  "l_humerus01_jj_044",
  "l_metacarpus01_jj_046",
  "r_scapula01_jj_066",
  "r_humerus01_jj_067",
  "r_metacarpus01_jj_069",
  "organ_protect_B_L_089",
  "organ_protect_B_R_091",
  "l_femur01_jj_0100",
  "l_metatarsus01_jj_0101",
  "r_femur01_jj_0123",
  "r_metatarsus01_jj_0125"
]

let shapeNames = [
  "MouseLiver_back",
  "MouseHeart_squash",
  "MouseHeart_back",
  "Gland1_long_scale",
  "Gland1_wide_scale",
  "Gland1_left_bend",
  "Gland1_right_bend",
  "Gland2_long_scale",
  "Gland2_wide_scale",
  "Gland2_left_bend",
  "Gland2_right_bend",  
]

let shapeClassNames = [
  "inputLiver",
  "inputHeart",
  "inputGland1",
  "inputGland2"
]

let camera;
let controls;
let renderer;
let scene;
let loop;
let blends = [];
let blend_models = [];
let bones = [];
let tem_bones = [];
let rotations = [];
let positions = [];
let inputx;
let inputy;
let inputz;
let inputRx;
let inputRy;
let inputRz;
let inputBlendShapes


class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    controls = createControls(camera, renderer.domElement);
    const { ambientLight, mainLight1, mainLight2, mainLight3, mainLight4, mainLight5, mainLight6 } = createLights();
    loop.updatables.push(controls);
    scene.add(ambientLight, mainLight1, mainLight2, mainLight3, mainLight4, mainLight5, mainLight6);
    const resizer = new Resizer(container, camera, renderer);
    let self = this;
  }

  async init() {

    const { modelData } = await loadModel('/assets/models/scene.gltf');

    const material = new MeshBasicMaterial({
      color: 0xff0000
    });

    let boneStructure;

    let helper;
    let bonesinittemp = []
    let bonestemp = []
    let model = modelData.scene.children[0].children[0].children[0].children[0];
    let blend_meshes = []
    let blend_shapes = []
    model.rotation.set(0, 0, 0);
    controls.target.copy(model.rotation);
    model.scale.set(0.1, 0.1, 0.1);
    scene.add(model);
    model.traverse((child) => {
      if (child.material) {
        child.material.side = BackSide;
      }
      if (child.morphTargetDictionary) {
        blend_meshes.push(child.name)
      }

    })
    boneStructure = scene.getObjectByProperty('type', "Bone");
    boneStructure.traverse((child) => {
      bonestemp.push(child)
    });

    for (let i = 0; i < bonestemp.length; i++) {
      if (bonenames.includes(bonestemp[i].name)) {

        bones.push(bonestemp[i]);
      }
    }

  /*   console.log("first")
    console.log(bones) */
    document.getElementById("joint-container").innerHTML = (bones.map((bone, index) => {
      positions.push({x: 0, y: 0, z: 0});
      rotations.push({x: 0, y: 0, z: 0});

      return `<div class="joint-card">
          <div class="joint-title">${bone.name}</div>
          
          <div class="joint-input">
              <div class="label" for="">X</div>
              <input class="joint-input-RX" type="number" step="0.05" placeholder="" value=0>
          </div>
          <div class="joint-input">
              <div class="label" for="">Y</div>
              <input class="joint-input-RY" type="number" step="0.05" placeholder="" value=0>
          </div>
          <div class="joint-input">
              <div class="label" for="">Z</div>
              <input class="joint-input-RZ" type="number" step="0.05" placeholder="" value=0>
          </div>
      </div>`
    }).join(" "));

    let shapeIndex = 0;
    let content = "";

    for (let i = 0; i < blend_meshes.length; i++) {
      blend_models.push(scene.getObjectByName(blend_meshes[i]));
      blends.push(scene.getObjectByName(blend_meshes[i]).morphTargetDictionary);

      for (let j = 0; j < blends.length; j++) {
        content += `
        <div class="blend-shape" style="height: auto; position: relative; display: flex; align-items: center; margin-bottom: 15px; color: white;">
            <label style="font-size: 24px; margin-right: 20px;">${shapeNames[shapeIndex]}</label> 
            <input class="${shapeClassNames[i]}" style="width: 100%; width: 150px; position: relative; border-radius: 10px; background-color: darkgray; border: none; outline: none; color: white; font-size: 20px; padding: 4px 10px;" step="0.05" type="number" placeholder="" value=0>
        </div>
      `
      shapeIndex ++
      } 
    }
    document.getElementById("slider-container").innerHTML = content;
    
    let inputLiver = document.getElementsByClassName("inputLiver");
    let inputHeart = document.getElementsByClassName("inputHeart");
    let inputGland1 = document.getElementsByClassName("inputGland1");
    let inputGland2 = document.getElementsByClassName("inputGland2");

    for (let i = 0; i < inputLiver.length; i++) {
      inputLiver[i].addEventListener("change", () => {
        blend_models[0].morphTargetInfluences[i] = parseFloat(Number(inputLiver[i].value));       
      })
    }

    
    for (let i = 0; i < inputHeart.length; i++) {
      inputHeart[i].addEventListener("change", () => {
        blend_models[1].morphTargetInfluences[i] = parseFloat(Number(inputHeart[i].value));
      })
    }

    for (let i = 0; i < inputGland1.length; i++) {
      inputGland1[i].addEventListener("change", () => {
        blend_models[2].morphTargetInfluences[i] = parseFloat(Number(inputGland1[i].value));    
      })
    }

    for (let i = 0; i < inputGland2.length; i++) {
      inputGland2[i].addEventListener("change", () => {
        blend_models[3].morphTargetInfluences[i] = parseFloat(Number(inputGland2[i].value));       
      })
    }


/*     document.getElementById("slider-container").innerHTML = (blend_shapes.map((blend) => (
      `
        <div class="blend-shape" style="height: auto; position: relative; display: flex; align-items: center; margin-bottom: 15px; color: white;">
            <label style="font-size: 24px; margin-right: 20px;">${blend.mesh_name}</label> 
            <input class="input-blend-shape" style="width: 100%; position: relative; border-radius: 10px; background-color: darkgray; border: none; outline: none; color: white; font-size: 20px; padding: 4px 10px;" step="0.05" type="number" placeholder="" value=0>
        </div>
      `
    )).join(" ")) */
    
    inputBlendShapes= document.getElementsByClassName("input-blend-shape");
    // inputx = document.getElementsByClassName("joint-input-X");
    // inputy = document.getElementsByClassName("joint-input-Y");
    // inputz = document.getElementsByClassName("joint-input-Z");
    inputRx = document.getElementsByClassName("joint-input-RX");
    inputRy = document.getElementsByClassName("joint-input-RY");
    inputRz = document.getElementsByClassName("joint-input-RZ");

    let blendLen = inputBlendShapes.length;
    for (let i = 0; i < blendLen; i++) {
      inputBlendShapes[i].addEventListener("change", () => {
        blend_shapes[i].blend_value = parseFloat(inputBlendShapes[i].value);             
      })
    }

    let inputLen = inputRx.length;
    for (let i = 0; i < inputLen; i++) {
      // inputx[i].addEventListener("change", () => {
      //   bones[i].position.setX(parseFloat(bones[i].position.x + (Number(inputx[i].value) - positions[i].x)));
      //   positions[i].x = Number(inputx[i].value);        
      //   bones[i].position.needsUpdate = true;
      // })

      // inputy[i].addEventListener("change", () => {
      //   bones[i].position.setY(parseFloat(bones[i].position.y + Number((inputy[i].value) - positions[i].y)));
      //   positions[i].y = Number(inputy[i].value);        
      //   bones[i].position.needsUpdate = true;
      // })

      // inputz[i].addEventListener("change", () => {
      //   bones[i].position.setZ(parseFloat(bones[i].position.z + (Number(inputz[i].value) - positions[i].z)));
      //   positions[i].z = Number(inputz[i].value);        
      //   bones[i].position.needsUpdate = true;
      // })
      inputRx[i].addEventListener("change", () => {
        bones[i].rotation.x = parseFloat(parseFloat(bones[i].rotation.x + (Number(inputRx[i].value) - rotations[i].x)));
        rotations[i].x = Number(inputRx[i].value);
        bones[i].rotation.needsUpdate = true;
      })

      inputRy[i].addEventListener("change", () => {
        bones[i].rotation.y = parseFloat(parseFloat(bones[i].rotation.y + (Number(inputRy[i].value) - rotations[i].y)));
        rotations[i].y = Number(inputRy[i].value);
        bones[i].rotation.needsUpdate = true;
      })

      inputRz[i].addEventListener("change", () => {
        bones[i].rotation.z = parseFloat(parseFloat(bones[i].rotation.z + (Number(inputRz[i].value) - rotations[i].z)));
        rotations[i].z = Number(inputRz[i].value);
        bones[i].rotation.needsUpdate = true;
      })
    }



    document.getElementById("export-btn").addEventListener("click", function () {
      // Apply bone transformations to the skinned mesh before exporting
      scene.traverse(function (object) {
        if (!object.isSkinnedMesh) return;
    
        var positionAttribute = object.geometry.getAttribute('position');
        var normalAttribute = object.geometry.getAttribute('normal');
        var v1 = new Vector3();
    
        positionAttribute.needsUpdate = true;
        normalAttribute.needsUpdate = true;
      });
    
      // Create a new OBJExporter
      var exporter = new OBJExporter();
    
      // Export the updated scene
      const result = exporter.parse(scene);
      const blob = new Blob([result], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "exported_model.obj";
      link.click();
    });
    
    

  }

  render() {
    controls.update();
    for (let i = 0; i < inputx.length; i++) {
      inputx[i].value = parseFloat(bones[i].rotation.x - rotations[i][0]).toFixed(2);
      inputy[i].value = parseFloat(bones[i].rotation.y - rotations[i][1]).toFixed(2);
      inputz[i].value = parseFloat(bones[i].rotation.z - rotations[i][2]).toFixed(2);
    }
    renderer.render(scene, camera);
  }

  start() {
    loop.start()
  }

  stop() {
    loop.stop();
  }
}
export { World };
