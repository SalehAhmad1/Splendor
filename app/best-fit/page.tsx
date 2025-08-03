"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  allJeans,
  allShirts,
  allOuterwear,
  allCasualTops,
  allTrousers,
  allCapeShawls,
  allCardigans,
  allDresses,
} from "../../model/sizeCharts/allMeasurements";

type Measurements = {
  height?: number;
  waist?: number;
  seat?: number;
  knee?: number;
  bottom?: number;
  inseam?: number;
  chest?: number;
  shoulderWidth?: number;
  armLength?: number;
  torsoLength?: number;
  legLength?: number;
};

// Map the folder category names to the measurement category names
const mapCategoryToMeasurementCategory = (category: string): string => {
  if (!category) return '';
  
  // Convert category to lowercase for case-insensitive comparison
  const lowerCategory = category.toLowerCase();
  
  // Map folder names to measurement categories
  const categoryMap: { [key: string]: string } = {
    'jeans': 'jeans',
    'jean': 'jeans',
    'shirt': 'shirts',
    'shirts': 'shirts',
    'outerwear': 'outerwear',
    'outer': 'outerwear',
    'outer-wear': 'outerwear',
    'blazer': 'outerwear',
    'jacket': 'outerwear',
    'jackets': 'outerwear',
    'coat': 'outerwear',
    'coats': 'outerwear',
    'casualtop': 'casualTops',
    'casual-top': 'casualTops',
    'casual-tops': 'casualTops',
    'casualtops': 'casualTops',
    'top': 'casualTops',
    'tops': 'casualTops',
    'trouser': 'trousers',
    'trousers': 'trousers',
    'pant': 'trousers',
    'pants': 'trousers',
    'cape': 'capeShawls',
    'cape-shawl': 'capeShawls',
    'capeshawl': 'capeShawls',
    'cape-shawls': 'capeShawls',
    'capeshawls': 'capeShawls',
    'shawl': 'capeShawls',
    'shawls': 'capeShawls',
    'cardigan': 'cardigans',
    'cardigans': 'cardigans',
    'dress': 'dresses',
    'dresses': 'dresses',
    'suit': 'outerwear',
    'suits': 'outerwear',
    'vest': 'outerwear',
    'vests': 'outerwear',
    'windbreaker': 'outerwear',
    'windbreakers': 'outerwear',
    'parka': 'outerwear',
    'parkas': 'outerwear',
  };

  // Return the mapped category or the original category if no mapping found
  const mappedCategory = categoryMap[lowerCategory] || category;
  console.log(`Mapping category: "${category}" (lowercase: "${lowerCategory}") → "${mappedCategory}"`);
  return mappedCategory;
};

function findBestFit(category: string, measurements: Measurements) {
  let bestFit = null;
  let minDifference = Infinity;

  const calculateDifference = (itemMeasurements: Measurements, userMeasurements: Measurements) => {
    let difference = 0;
    for (const key in itemMeasurements) {
      if (userMeasurements[key as keyof Measurements] !== undefined) {
        difference += Math.abs(itemMeasurements[key as keyof Measurements]! - userMeasurements[key as keyof Measurements]!);
      }
    }
    return difference;
  };

  const compareSizes = (items: { measurements: Measurements; size: string | number }[], userMeasurements: Measurements) => {
    items.forEach((item) => {
      const difference = calculateDifference(item.measurements, userMeasurements);
      if (difference < minDifference) {
        minDifference = difference;
        bestFit = item.size;
      }
    });
  };

  // Map the category to the correct measurement category
  const mappedCategory = mapCategoryToMeasurementCategory(category);

  switch (mappedCategory) {
    case "jeans":
      compareSizes(allJeans, measurements);
      break;
    case "shirts":
      compareSizes(allShirts, measurements);
      break;
    case "outerwear":
      compareSizes(allOuterwear, measurements);
      break;
    case "casualTops":
      compareSizes(allCasualTops, measurements);
      break;
    case "trousers":
      compareSizes(allTrousers, measurements);
      break;
    case "capeShawls":
      compareSizes(allCapeShawls, measurements);
      break;
    case "cardigans":
      compareSizes(allCardigans, measurements);
      break;
    case "dresses":
      compareSizes(allDresses, measurements);
      break;
    default:
      console.warn(`Unknown category: ${category}, mapped to: ${mappedCategory}`);
      break;
  }

  return bestFit;
}

const getAvailableSizes = (category: string | null) => {
  if (!category) return '';
  
  const mappedCategory = mapCategoryToMeasurementCategory(category);
  console.log("Getting sizes for category:", mappedCategory);
  
  let sizes = '';
  
  switch (mappedCategory) {
    case 'jeans':
      sizes = allJeans.map((jean) => jean.size).join(', ');
      console.log("Jeans sizes:", sizes);
      return sizes;
    case 'shirts':
      sizes = allShirts.map((shirt) => shirt.size).join(', ');
      console.log("Shirts sizes:", sizes);
      return sizes;
    case 'outerwear':
      sizes = allOuterwear.map((outerwear) => outerwear.size).join(', ');
      console.log("Outerwear sizes:", sizes);
      return sizes;
    case 'casualTops':
      sizes = allCasualTops.map((top) => top.size).join(', ');
      console.log("Casual Tops sizes:", sizes);
      return sizes;
    case 'trousers':
      sizes = allTrousers.map((trouser) => trouser.size).join(', ');
      console.log("Trousers sizes:", sizes);
      return sizes;
    case 'capeShawls':
      sizes = allCapeShawls.map((capeShawl) => capeShawl.size).join(', ');
      console.log("Cape Shawls sizes:", sizes);
      return sizes;
    case 'cardigans':
      sizes = allCardigans.map((cardigan) => cardigan.size).join(', ');
      console.log("Cardigans sizes:", sizes);
      return sizes;
    case 'dresses':
      sizes = allDresses.map((dress) => dress.size).join(', ');
      console.log("Dresses sizes:", sizes);
      return sizes;
    default:
      console.warn(`Unknown category in getAvailableSizes: "${category}", mapped to: "${mappedCategory}"`);
      return '';
  }
};

export default function Bestfit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const height = searchParams.get("height");
  const chest = searchParams.get("chest");
  const shoulder_width = searchParams.get("shoulder_width");
  const arm_length = searchParams.get("arm_length");
  const leg_length = searchParams.get("leg_length");
  const waist = searchParams.get("waist");
  const navel_length = searchParams.get("navel_length");
  const torso_length = searchParams.get("torso_length");
  const image = searchParams.get("image");
  const title = searchParams.get("title");
  const gender = searchParams.get("gender");
  const category = searchParams.get("category");

  console.log("Search params:", Object.fromEntries([...searchParams.entries()]));
  console.log("Category from URL:", category);
  console.log("Mapped category:", category ? mapCategoryToMeasurementCategory(category) : null);

  const userMeasurements: Measurements = {
    height: height ? parseFloat(height) : undefined,
    chest: chest ? parseFloat(chest) : undefined,
    shoulderWidth: shoulder_width ? parseFloat(shoulder_width) : undefined,
    armLength: arm_length ? parseFloat(arm_length) : undefined,
    legLength: leg_length ? parseFloat(leg_length) : undefined,
    waist: waist ? parseFloat(waist) : undefined,
    torsoLength: torso_length ? parseFloat(torso_length) : undefined,
  };

  const mappedCategory = category ? mapCategoryToMeasurementCategory(category) : null;
  const bestFitSize = mappedCategory ? findBestFit(mappedCategory, userMeasurements) : null;

  console.log("Mapped Category:", mappedCategory);
  console.log("Best fit size:", bestFitSize);

  useEffect(() => {
    if (category) {
      console.log("Category from props:", category);
      const mapped = mapCategoryToMeasurementCategory(category);
      console.log("Mapped category:", mapped);
      console.log("Available sizes:", getAvailableSizes(category));
    }
  }, [category]);

  const renderMeasurements = () => {
    if (!category) return null;
    
    const mappedCategory = mapCategoryToMeasurementCategory(category);
    
    switch (mappedCategory) {
      case 'jeans':
        return (
          <>
            {waist && <h2>Waist: <b>{waist}</b></h2>}
            {userMeasurements.seat && <h2>Seat: <b>{userMeasurements.seat}</b></h2>}
            {userMeasurements.knee && <h2>Knee: <b>{userMeasurements.knee}</b></h2>}
            {userMeasurements.bottom && <h2>Bottom: <b>{userMeasurements.bottom}</b></h2>}
            {userMeasurements.inseam && <h2>Inseam: <b>{userMeasurements.inseam}</b></h2>}
          </>
        );
      case 'shirts':
        return (
          <>
            {chest && <h2>Chest: <b>{chest}</b></h2>}
            {shoulder_width && <h2>Shoulder Width: <b>{shoulder_width}</b></h2>}
            {arm_length && <h2>Arm Length: <b>{arm_length}</b></h2>}
            {waist && <h2>Waist: <b>{waist}</b></h2>}
          </>
        );
      case 'outerwear':
        return (
          <>
            {chest && <h2>Chest: <b>{chest}</b></h2>}
            {shoulder_width && <h2>Shoulder Width: <b>{shoulder_width}</b></h2>}
            {arm_length && <h2>Arm Length: <b>{arm_length}</b></h2>}
            {torso_length && <h2>Torso Length: <b>{torso_length}</b></h2>}
          </>
        );
      case 'casualTops':
        return (
          <>
            {chest && <h2>Chest: <b>{chest}</b></h2>}
            {arm_length && <h2>Arm Length: <b>{arm_length}</b></h2>}
            {torso_length && <h2>Torso Length: <b>{torso_length}</b></h2>}
          </>
        );
      case 'trousers':
        return (
          <>
            {waist && <h2>Waist: <b></b>{waist}</h2>}
            {userMeasurements.bottom && <h2>Bottom: <b>{userMeasurements.bottom}</b></h2>}
            {userMeasurements.inseam && <h2>Inseam: <b>{userMeasurements.inseam}</b></h2>}
          </>
        );
      case 'capeShawls':
        return (
          <>
            {shoulder_width && <h2>Shoulder Width: <b>{shoulder_width}</b></h2>}
            {torso_length && <h2>Torso Length: <b>{torso_length}</b></h2>}
            {chest && <h2>Chest: <b>{chest}</b></h2>}
          </>
        );
      case 'cardigans':
        return (
          <>
            {chest && <h2>Chest: <b>{chest}</b></h2>}
            {shoulder_width && <h2>Shoulder Width: <b>{shoulder_width}</b></h2>}
            {arm_length && <h2>Arm Length: <b>{arm_length}</b></h2>}
          </>
        );
      case 'dresses':
        return (
          <>
            {chest && <h2>Chest: <b>{chest}</b></h2>}
            {shoulder_width && <h2>Shoulder Width: <b>{shoulder_width}</b></h2>}
            {torso_length && <h2>Torso Length: <b>{torso_length}</b></h2>}
          </>
        );
      default:
        console.warn(`Unknown category: ${category}, mapped to: ${mappedCategory}`);
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full p-4 flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl text-center text-DeepGold font-bold">Best Fit Size Recommendation Based On Your Body Measurements</h1>
        <div className="mainContents flex md:flex-row flex-col gap-8 items-center my-8 ">
            <div className="img w-[320] h-auto bg-DeepGold flex items-center justify-center rounded-3xl p-2 py-2 shadow-lg">
                {image && <Image src={image} alt="image" width={300} height={300} className="rounded-3xl" />}
            </div>
            <div className="data flex flex-col gap-6">
                <h2>Title: <b>{title}</b></h2>
                <h2>For: <b>{gender}</b></h2>
                <h2>Category: <b>{category} {mappedCategory && mappedCategory !== category && `(${mappedCategory})`}</b></h2>
                {renderMeasurements()}
                <h2>Available Sizes: <b>{getAvailableSizes(category)}</b></h2>
                <h2 className="bg-DeepGold w-52 rounded-lg pl-3 py-2 text-lg">Recommended Size: <b>{bestFitSize}</b></h2>
            </div>
        </div>
    </div>
  );
}