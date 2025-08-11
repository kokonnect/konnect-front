import React from "react";
import { View, StyleSheet } from "react-native";

interface SkeletonLoaderProps {
  height?: number;
  width?: string | number;
  borderRadius?: number;
  marginBottom?: number;
}

export default function SkeletonLoader({
  height = 20,
  width = "100%",
  borderRadius = 4,
  marginBottom = 8,
}: SkeletonLoaderProps) {
  return (
    <View
      style={[
        styles.skeleton,
        {
          height,
          width,
          borderRadius,
          marginBottom,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#e0e0e0",
  },
});
