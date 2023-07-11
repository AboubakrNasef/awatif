import * as THREE from "three";

type NodeProps = {
  position: any;
};

export function Node(props: NodeProps) {
  if (
    !props.position ||
    props.position.flat().length != 3 || // flat() to fix a weird javascript bug with [0,,1]
    props.position.some((p: any) => typeof p !== "number")
  )
    return;

  const points = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({ size: 0.3 })
  );

  const swapYZ = [props.position[0], props.position[2], props.position[1]];

  points.geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(swapYZ, 3)
  );

  return <>{points}</>;
}
