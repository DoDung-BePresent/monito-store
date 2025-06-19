import type { Pet } from "@/types/pet";
import { generateRandomDate, getRandomBoolean, getRandomElement, getRandomNumber } from "@/utils/helper";

const breeds = [
  {
    _id: 'breed1',
    name: 'Golden Retriever',
    description: 'Friendly and intelligent',
  },
  { _id: 'breed2', name: 'Labrador', description: 'Outgoing and active' },
  {
    _id: 'breed3',
    name: 'German Shepherd',
    description: 'Confident and courageous',
  },
  { _id: 'breed4', name: 'Pomeranian', description: 'Small and fluffy' },
  { _id: 'breed5', name: 'Bulldog', description: 'Calm and courageous' },
  { _id: 'breed6', name: 'Beagle', description: 'Friendly and curious' },
  { _id: 'breed7', name: 'Poodle', description: 'Intelligent and active' },
  { _id: 'breed8', name: 'Shiba Inu', description: 'Alert and agile' },
  { _id: 'breed9', name: 'Corgi', description: 'Intelligent herding dog' },
  { _id: 'breed10', name: 'Husky', description: 'Medium-sized working dog' },
];

const colors = [
  {
    _id: 'color1',
    name: 'Brown',
    hexCode: '#8B4513',
    description: 'Rich brown color',
  },
  {
    _id: 'color2',
    name: 'Black',
    hexCode: '#000000',
    description: 'Deep black color',
  },
  {
    _id: 'color3',
    name: 'White',
    hexCode: '#FFFFFF',
    description: 'Pure white color',
  },
  {
    _id: 'color4',
    name: 'Golden',
    hexCode: '#FFD700',
    description: 'Golden color',
  },
  {
    _id: 'color5',
    name: 'Gray',
    hexCode: '#808080',
    description: 'Gray color',
  },
  {
    _id: 'color6',
    name: 'Cream',
    hexCode: '#F5F5DC',
    description: 'Cream color',
  },
  { _id: 'color7', name: 'Red', hexCode: '#FF0000', description: 'Red color' },
  {
    _id: 'color8',
    name: 'Tricolor',
    hexCode: '#8B4513',
    description: 'Multiple colors',
  },
];
const petNames = [
  'Buddy',
  'Max',
  'Charlie',
  'Cooper',
  'Rocky',
  'Bear',
  'Tucker',
  'Duke',
  'Jack',
  'Toby',
  'Oliver',
  'Zeus',
  'Leo',
  'Oscar',
  'Milo',
  'Bentley',
  'Luna',
  'Bella',
  'Lucy',
  'Molly',
  'Sophie',
  'Sadie',
  'Chloe',
  'Lily',
  'Maggie',
  'Penny',
  'Ruby',
  'Grace',
  'Annie',
  'Stella',
  'Zoe',
  'Rosie',
];

const locations = [
  'Vietnam',
  'Ho Chi Minh City',
  'Hanoi',
  'Da Nang',
  'Can Tho',
  'Nha Trang',
];

const imageUrls = [
  'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1520087619250-584c0cbd35e8?w=600&auto=format&fit=crop&q=60',
];

export const generateMockPets = (count: number = 30): Pet[] => {
  const pets: Pet[] = [];

  for (let i = 0; i < count; i++) {
    const breed = getRandomElement(breeds);
    const color = getRandomElement(colors);
    const name = getRandomElement(petNames);

    const basePrice = getRandomNumber(2000000, 15000000);
    const createdAt = generateRandomDate(new Date('2024-01-01'), new Date());
    const updatedAt = generateRandomDate(new Date(createdAt), new Date());

    const pet: Pet = {
      _id: `pet_${i + 1}`,
      name: `${name} ${breed.name.split(' ')[0]}`,
      breed: breed,
      gender: getRandomElement(['Male', 'Female']),
      age: getRandomElement([
        '2 months',
        '3 months',
        '4 months',
        '6 months',
        '1 year',
        '2 years',
      ]),
      size: getRandomElement(['Small', 'Medium', 'Large']),
      color: color,
      price: basePrice,
      images: [getRandomElement(imageUrls)],
      description: `Beautiful ${color.name.toLowerCase()} ${breed.name} with excellent temperament and health.`,
      isVaccinated: getRandomBoolean(0.8),
      isDewormed: getRandomBoolean(0.7),
      hasCert: getRandomBoolean(0.6),
      hasMicrochip: getRandomBoolean(0.4),
      location: getRandomElement(locations),
      publishedDate: createdAt,
      additionalInfo: getRandomBoolean(0.3)
        ? 'Great with children and other pets'
        : undefined,
      isAvailable: getRandomBoolean(0.9),
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    pets.push(pet);
  }

  return pets;
};

export const mockPets = generateMockPets(30);
export const mockColors = colors;
