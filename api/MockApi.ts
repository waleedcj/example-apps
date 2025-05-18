// db searchable items
const DUMMY_DATA_SOURCE = [
    "React Native Guide", "JavaScript Basics", "Expo Configuration",
    "Animated Components in React", "Styling in Expo", "State Management with Zustand",
    "Networking with Fetch API", "Redux Toolkit Examples", "TypeScript for Beginners",
    "Native Modules Explained", "UI Design Principles", "Component Libraries",
    "Firebase Integration", "GraphQL Queries", "REST API Best Practices",
    "App Deployment Steps", "Performance Optimization", "Debugging Techniques",
    "Data Structures", "Algorithms in JS", "Software Architecture",
    "Project Management Tools", "Agile Development", "Scrum Master Guide",
    "Version Control with Git", "GitHub Collaboration", "CI/CD Pipelines",
    "Docker for Developers", "Kubernetes Overview", "Cloud Computing AWS",
    "Google Cloud Platform", "Microsoft Azure Services"
  ];
  
  export type SearchResult = {
    id: string;
    title: string;
  }
  
  // Simulates an API call
  export const fetchSearchResults = async (query: string): Promise<SearchResult[]> => {
    console.log(`API: Searching for "${query}"`);
    if (!query || query.length < 1) { // Allow search for 1 char for this dummy example
      return [];
    }
  
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
  
    const lowerCaseQuery = query.toLowerCase();
    const results = DUMMY_DATA_SOURCE
      .filter(item => item.toLowerCase().includes(lowerCaseQuery))
      .map((item, index) => ({ id: `${index}-${item.replace(/\s+/g, '-')}`, title: item }));
    
    console.log(`API: Found ${results.length} results for "${query}"`);
    return results;
  };