import * as THREE from 'three'
import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Suspense } from 'react'
import { useThree, useGraph } from '@react-three/fiber'
import './index.css';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { TextureLoader } from 'three'

// model url
const pawnModelUrl = "./3d-models/PawnHuman.gltf";
const knightModelUrl = "./3d-models/KnightHuman.gltf";
const bishopModelUrl = "./3d-models/BishopHuman.gltf";
const rookModelUrl = "./3d-models/RookHuman.gltf";
const queenModelUrl = "./3d-models/QueenHuman.gltf";
const kingModelUrl = "./3d-models/KingHuman.gltf";

const boardModelUrl = "./3d-models/board.glb";
const mapModelUrl = "./3d-models/Colliseum.gltf"

// color2 texture url
const pawnColor2Url = "./3d-models/textures/PawnHuman2_Pawn_Human_AlbedoTransparency.png";
const knightColor2Url = "./3d-models/textures/KnightHuman2_knighthuman_ColorAlpha.png";
const bishopColor2Url = "./3d-models/textures/BishopHuman2_Bishop_human_ColorAlpha.png";
const rookColor2Url = "./3d-models/textures/RookHuman2_rookhuman_ColorAlpha.png";
const queenColor2Url = "./3d-models/textures/QueenHuman2_queenhuman_ColorAlpha.png";
const queenColor2CloakUrl = "./3d-models/textures/QueenHuman2_queenhuman_2s_ColorAlpha.png";
const kingColor2Url = "./3d-models/textures/KingHuman2_king_ColorAlpha.png";
const kingColor2CloakUrl = "./3d-models/textures/KingHuman2_king_2s_ColorAlpha.png";

const boardSquareWidth = 25;
let pieceArr: Piece[] = [];

class Piece {
  type: string;
  name: string;
  object: THREE.Object3D;
  animation: THREE.AnimationMixer;
  constructor(type: string, name: string, object: THREE.Object3D, animation: THREE.AnimationMixer) {
    this.type = type;
    this.animation = animation;
    this.name = name;
    this.object = object;
  };
}

function CameraController() {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      camera.position.y = 200;
      camera.far = 1000;
      camera.near = 1;
      const controls = new OrbitControls(camera, gl.domElement);
      return () => {
        controls.dispose();
      };
    },
    [camera, gl]
  );
  return (
    <>
    </>
  );
};

function LoadPieces(scene: THREE.Object3D, type: string, texture: THREE.Texture, extraTexture?: THREE.Texture): Piece[] {
  const pieceRenderingArr: Piece[] = [];
  if (type === "pawn") {
    // render all pawns
    scene.position.x = -3.5 * boardSquareWidth;
    scene.position.z = -2.5 * boardSquareWidth;
    const templateMixer = new THREE.AnimationMixer(scene);
    const templateModel = new Piece("pawn", "PawnA7", scene, templateMixer);
    pieceRenderingArr.push(templateModel);
    // clone 7 pawns
    for (let i = 0; i < 7; i++) {
      const pawnClone = SkeletonUtils.clone(scene);
      pawnClone.position.x = (i - 2.5) * boardSquareWidth;
      pawnClone.position.z = -2.5 * boardSquareWidth;
      const pieceName = "pawn" + String.fromCharCode(98 + i).toUpperCase() + "7";
      const mixer = new THREE.AnimationMixer(pawnClone);
      pieceRenderingArr.push(new Piece("pawn", pieceName, pawnClone, mixer));
    }
    // create blue clone pawn object
    const bluePawn = SkeletonUtils.clone(scene);
    bluePawn.traverse((node) => {
      if (node instanceof THREE.SkinnedMesh) {
        scene.traverse((node1) => {
          if (node1 instanceof THREE.SkinnedMesh) {
            node.material = node1.material.clone();
          }
        })
        node.material.map = texture;
        node.material.needsUpdate = true;
      }
    })
    bluePawn.position.x = -3.5 * boardSquareWidth;
    bluePawn.position.z = 2.5 * boardSquareWidth;
    bluePawn.rotation.y = Math.PI;
    const bluePawnMixer = new THREE.AnimationMixer(bluePawn);
    pieceRenderingArr.push(new Piece("pawn", "PawnA2", bluePawn, bluePawnMixer));
    // clone 7 blue pawns
    for (let i = 0; i < 7; i++) {
      const pawnClone = SkeletonUtils.clone(bluePawn);
      pawnClone.position.x = (i - 5 + 2.5) * boardSquareWidth;
      pawnClone.position.z = +2.5 * boardSquareWidth;
      const pieceName = "pawn" + String.fromCharCode(98 + i).toUpperCase() + "2";
      const mixer = new THREE.AnimationMixer(pawnClone);
      pieceRenderingArr.push(new Piece("pawn", pieceName, pawnClone, mixer));
    }
  }
  if (type === "knight" || type === "bishop" || type === "rook") {
    let index = 0;
    if (type === "knight") {
      index = 1;
    }
    if (type === "bishop") {
      index = 2;
    }
    scene.position.x = (-3.5 + index) * boardSquareWidth;
    scene.position.z = -3.5 * boardSquareWidth;
    const pieceName = type + String.fromCharCode(97 + index).toUpperCase() + "8";
    const templateModel = new Piece(type, pieceName, scene, new THREE.AnimationMixer(scene));
    pieceRenderingArr.push(templateModel);
    const PieceClone = SkeletonUtils.clone(scene);
    PieceClone.position.x = (3.5 - index) * boardSquareWidth;
    PieceClone.position.z = -3.5 * boardSquareWidth;
    const pieceName1 = type + String.fromCharCode(104 - index).toUpperCase() + "8";
    pieceRenderingArr.push(new Piece(type, pieceName1, PieceClone, new THREE.AnimationMixer(PieceClone)));
    // create blue clone
    const bluePiece = SkeletonUtils.clone(scene);
    bluePiece.traverse((node) => {
      if (node instanceof THREE.SkinnedMesh) {
        scene.traverse((node1) => {
          if (node1 instanceof THREE.SkinnedMesh) {
            node.material = node1.material.clone();
          }
        })
        node.material.map = texture;
        node.material.needsUpdate = true;
      }
    })
    bluePiece.position.x = (3.5 - index) * boardSquareWidth;
    bluePiece.position.z = 3.5 * boardSquareWidth;
    bluePiece.rotation.y = Math.PI;
    const pieceName2 = type + String.fromCharCode(104 - index).toUpperCase() + "1";
    pieceRenderingArr.push(new Piece(type, pieceName2, bluePiece, new THREE.AnimationMixer(bluePiece)));
    const bluePieceClone = SkeletonUtils.clone(bluePiece);
    bluePieceClone.position.x = (-3.5 + index) * boardSquareWidth;
    bluePieceClone.position.z = 3.5 * boardSquareWidth;
    const pieceName3 = type + String.fromCharCode(97 + index).toUpperCase() + "1";
    pieceRenderingArr.push(new Piece(type, pieceName3, bluePieceClone, new THREE.AnimationMixer(bluePieceClone)));
  }
  if (type === "king" || type === "queen") {
    let index = 0;
    if (type === "king") {
      index = 1;
    }
    scene.position.x = (-0.5 + index) * boardSquareWidth;
    scene.position.z = -3.5 * boardSquareWidth;
    const pieceName = type + String.fromCharCode(100 + index).toUpperCase() + "8";
    const templateModel = new Piece(type, pieceName, scene, new THREE.AnimationMixer(scene));
    pieceRenderingArr.push(templateModel);
    // create blue clone
    const bluePiece = SkeletonUtils.clone(scene);
    bluePiece.traverse((node) => {
      if (node instanceof THREE.SkinnedMesh) {
        scene.traverse((node1) => {
          if (node1 instanceof THREE.SkinnedMesh) {
            if (node.name === "Mesh001" && node1.name === "Mesh001") {
              node.material = node1.material.clone();
              node.material.map = texture;
              node.material.needsUpdate = true;
            }
            if (node.name === "Mesh001_1" && node1.name === "Mesh001_1") {
              node.material = node1.material.clone();
              node.material.map = extraTexture;
              node.material.needsUpdate = true;
            }
          }
        })
      }
    })
    bluePiece.position.x = (-0.5 + index) * boardSquareWidth;
    bluePiece.position.z = 3.5 * boardSquareWidth;
    bluePiece.rotation.y = Math.PI;
    const pieceName2 = type + String.fromCharCode(100 + index).toUpperCase() + "1";
    pieceRenderingArr.push(new Piece(type, pieceName2, bluePiece, new THREE.AnimationMixer(bluePiece)));
  }
  return pieceRenderingArr;
}

function InitModel() {
  let pieceRenderingArr: Piece[] = [];
  const templateSceneArr: THREE.Object3D[] = [];
  const templateTextureArr: THREE.Texture[] = [];
  const pawn = useLoader(GLTFLoader, pawnModelUrl);
  const knight = useLoader(GLTFLoader, knightModelUrl);
  const bishop = useLoader(GLTFLoader, bishopModelUrl);
  const rook = useLoader(GLTFLoader, rookModelUrl);
  const queen = useLoader(GLTFLoader, queenModelUrl);
  const king = useLoader(GLTFLoader, kingModelUrl);
  templateSceneArr.push(pawn.scene, knight.scene, bishop.scene, rook.scene, queen.scene, king.scene);
  templateSceneArr.forEach(scene => {
    scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.material.metalness = 0;
      }
    })
  })
  const pawnColor2Texture = useLoader(TextureLoader, pawnColor2Url);
  const knightColor2Texture = useLoader(TextureLoader, knightColor2Url);
  const bishopColor2Texture = useLoader(TextureLoader, bishopColor2Url);
  const rookColor2Texture = useLoader(TextureLoader, rookColor2Url);
  const queenColor2Texture = useLoader(TextureLoader, queenColor2Url);
  const queenColor2CloakTexture = useLoader(TextureLoader, queenColor2CloakUrl);
  const kingColor2Texture = useLoader(TextureLoader, kingColor2Url);
  const kingColor2CloakTexture = useLoader(TextureLoader, kingColor2CloakUrl);
  templateTextureArr.push(pawnColor2Texture, knightColor2Texture, bishopColor2Texture,
    rookColor2Texture, queenColor2Texture, queenColor2CloakTexture, kingColor2Texture, kingColor2CloakTexture);
  templateTextureArr.forEach(texture => {
    texture.flipY = false;
    texture.encoding = THREE.sRGBEncoding;
  })
  const tempPawnRenderingArr = LoadPieces(pawn.scene, "pawn", pawnColor2Texture);
  const tempKnightRenderingArr = LoadPieces(knight.scene, "knight", knightColor2Texture);
  const tempBishopRenderingArr = LoadPieces(bishop.scene, "bishop", bishopColor2Texture);
  const tempRookRenderingArr = LoadPieces(rook.scene, "rook", rookColor2Texture);
  const tempQueenRenderingArr = LoadPieces(queen.scene, "queen", queenColor2Texture, queenColor2CloakTexture);
  const tempKingRenderingArr = LoadPieces(king.scene, "king", kingColor2Texture, kingColor2CloakTexture);
  pieceRenderingArr = pieceRenderingArr.concat(tempPawnRenderingArr)
    .concat(tempKnightRenderingArr).concat(tempRookRenderingArr)
    .concat(tempBishopRenderingArr).concat(tempQueenRenderingArr).concat(tempKingRenderingArr);
  useEffect(() => {
    pieceArr = pieceArr.concat(pieceRenderingArr);
  }, [pawn])
  return (
    <>
      {pieceRenderingArr.map((piece) => <primitive onClick={() => clickOnPieces(piece)} object={piece.object} scale={0.015} key={piece.name} />)}
    </>
  );
}

function Board() {
  const gltf = useLoader(GLTFLoader, boardModelUrl);
  gltf.scene.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      node.material.metalness = 0;
    }
  })
  return (
    <>
      <primitive onClick={(e: ThreeEvent<any>) => clickOnBoard(gltf.scene, e)} object={gltf.scene} scale={1} />
    </>
  );
}

function Map() {
  const gltf = useLoader(GLTFLoader, mapModelUrl);
  gltf.scene.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      node.material.metalness = 0;
    }
  })
  return (
    <>
      <primitive object={gltf.scene} scale={1} />
    </>
  );
}

function checkSomeThing() {
  console.log(pieceArr);
}

function clickOnPieces(piece: Piece) {
  console.log("You clicked on "+ piece.name);
}

function clickOnBoard(board: THREE.Object3D, event: ThreeEvent<any>) {
  let position = transferCoordToSquares(event.point.x, event.point.z);
  console.log("You clicked on " + position);
}

function transferCoordToSquares(x: number, z: number) {
  let character = "A";
  let number = "8";
  if (x > -100 && x < -75) {

  }
  if (x > -75 && x < -50) {
    character = "B";
  }
  if (x > -50 && x < -25) {
    character = "C";
  }
  if (x > -25 && x < 0) {
    character = "D";
  }
  if (x > 0 && x < 25) {
    character = "E";
  }
  if (x > 25 && x < 50) {
    character = "F";
  }
  if (x > 50 && x < 75) {
    character = "G";
  }
  if (x > 75 && x < 100) {
    character = "H";
  }
  if (z > -100 && z < -75) {

  }
  if (z > -75 && z < -50) {
    number = "7";
  }
  if (z > -50 && z < -25) {
    number = "6";
  }
  if (z > -25 && z < 0) {
    number = "5";
  }
  if (z > 0 && z < 25) {
    number = "4";
  }
  if (z > 25 && z < 50) {
    number = "3";
  }
  if (z > 50 && z < 75) {
    number = "2";
  }
  if (z > 75 && z < 100) {
    number = "1";
  }
  return character + number;
}

export default function ChessCanvas3D() {
  return (
    <div id='ChessCanvas3D'>
      <Canvas>
        <pointLight position={[150, 150, 150]} color={"#ffffff"} intensity={1} distance={500} />
        <pointLight position={[-75, 150, -150]} color={"#ffffff"} intensity={1} distance={500} />
        <Suspense fallback={null}>
          <InitModel />
          <Board />
          <Map />
        </Suspense>
        <CameraController />
      </Canvas>
      <button onClick={() => checkSomeThing()}>Check</button>
    </div>
  )
}
