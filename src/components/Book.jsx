import { useCursor, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { easing } from "maath";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  // IMPORTED MeshBasicMaterial
  MeshBasicMaterial,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { pageAtom } from "./UI";

const easingFactor = 0.5;
const easingFactorFold = 0.3;

// Fixed constants
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;

const whiteColor = new Color("white");
const emissiveColor = new Color("orange");

// Keep spine/edges as Standard for some 3D depth, or could be Basic too.
const pageMaterials = [
  new MeshStandardMaterial({ color: whiteColor }),
  new MeshStandardMaterial({ color: "#111" }),
  new MeshStandardMaterial({ color: whiteColor }),
  new MeshStandardMaterial({ color: whiteColor }),
];

// --- HELPER: Generate geometry dynamically based on width ---
const createPageGeometry = (width) => {
  const segmentWidth = width / PAGE_SEGMENTS;
  const geometry = new BoxGeometry(
    width,
    PAGE_HEIGHT,
    PAGE_DEPTH,
    PAGE_SEGMENTS,
    2
  );

  geometry.translate(width / 2, 0, 0);

  const position = geometry.attributes.position;
  const vertex = new Vector3();
  const skinIndexes = [];
  const skinWeights = [];

  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);
    const x = vertex.x;
    const skinIndex = Math.max(0, Math.floor(x / segmentWidth));
    let skinWeight = (x % segmentWidth) / segmentWidth;
    skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
  }

  geometry.setAttribute(
    "skinIndex",
    new Uint16BufferAttribute(skinIndexes, 4)
  );
  geometry.setAttribute(
    "skinWeight",
    new Float32BufferAttribute(skinWeights, 4)
  );

  return { geometry, segmentWidth };
};

const Page = ({ number, front, back, page, opened, bookClosed, width, totalPages, ...props }) => {
  const [picture, picture2] = useTexture([front, back]);
  picture.colorSpace = picture2.colorSpace = SRGBColorSpace;
  
  const group = useRef();
  const turnedAt = useRef(0);
  const lastOpened = useRef(opened);
  const skinnedMeshRef = useRef();

  // --- MEMOIZED MESH GENERATION ---
  const manualSkinnedMesh = useMemo(() => {
    // Generate geometry specifically for this width
    const { geometry, segmentWidth } = createPageGeometry(width);

    const bones = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      let bone = new Bone();
      bones.push(bone);
      if (i === 0) {
        bone.position.x = 0;
      } else {
        bone.position.x = segmentWidth;
      }
      if (i > 0) {
        bones[i - 1].add(bone);
      }
    }
    const skeleton = new Skeleton(bones);

    const materials = [
      ...pageMaterials,
      // UPDATED: Use MeshBasicMaterial for the pages with images.
      // This ignores lights/shadows and shows the "exact coloring" of the image.
      new MeshBasicMaterial({
        color: whiteColor,
        map: picture,
        toneMapped: false, // Prevents colors from being washed out by renderer
      }),
      new MeshBasicMaterial({
        color: whiteColor,
        map: picture2,
        toneMapped: false, // Prevents colors from being washed out by renderer
      }),
    ];
    
    const mesh = new SkinnedMesh(geometry, materials);
    
    mesh.castShadow = false; 
    mesh.receiveShadow = false;
    
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    return mesh;
  }, [picture, picture2, width]); 

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current) return;

    // REMOVED: Emissive highlight logic
    // (MeshBasicMaterial does not support emissive intensity in the same way, 
    // and it was likely interfering with the pure color look)

    if (lastOpened.current !== opened) {
      turnedAt.current = +new Date();
      lastOpened.current = opened;
    }
    
    // --- ROTATION LOGIC ---
    let targetRotation = 0;
    
    if (opened) {
      targetRotation = -Math.PI / 2; 
    } else {
      targetRotation = Math.PI / 2;
    }

    if (!bookClosed) {
       const offset = number * 0.005; 
       targetRotation += opened ? offset : -offset;
    }

    const bones = skinnedMeshRef.current.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group.current : bones[i];

      let rotationAngle = 0;
      if (i === 0) {
          rotationAngle = targetRotation;
      }

      let foldRotationAngle = 0; 

      easing.dampAngle(target.rotation, "y", rotationAngle, easingFactor, delta);
      easing.dampAngle(target.rotation, "x", foldRotationAngle, easingFactorFold, delta);
    }
  });

  const [_, setPage] = useAtom(pageAtom);
  const [highlighted, setHighlighted] = useState(false);
  useCursor(highlighted);

  return (
    <group
      {...props}
      ref={group}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHighlighted(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHighlighted(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setPage(opened ? number : number + 1);
        setHighlighted(false);
      }}
    >
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />
    </group>
  );
};

export const Book = ({ pages, width = 1.28, ...props }) => {
  const [page] = useAtom(pageAtom);
  const [delayedPage, setDelayedPage] = useState(page);

  useEffect(() => {
    let timeout;
    const goToPage = () => {
      setDelayedPage((delayedPage) => {
        if (page === delayedPage) {
          return delayedPage;
        } else {
          timeout = setTimeout(
            () => {
              goToPage();
            },
            Math.abs(page - delayedPage) > 2 ? 50 : 150
          );
          if (page > delayedPage) {
            return delayedPage + 1;
          }
          if (page < delayedPage) {
            return delayedPage - 1;
          }
        }
      });
    };
    goToPage();
    return () => {
      clearTimeout(timeout);
    };
  }, [page]);

  return (
    <group {...props} rotation-y={-Math.PI / 2}>
      {pages.map((pageData, index) => (
        <Page
          key={index}
          page={delayedPage}
          number={index}
          totalPages={pages.length}
          opened={delayedPage > index}
          bookClosed={delayedPage === 0 || delayedPage === pages.length}
          width={width} 
          {...pageData}
        />
      ))}
    </group>
  );
};
