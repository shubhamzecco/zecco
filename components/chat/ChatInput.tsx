"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  isLoading: boolean;
  onSend: (text: string) => void;
};

export default function ChatInput({ isLoading, onSend }: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <div className="shrink-0 p-4 bg-[#F3F8FF] border-t border-blue-100">
      <div className="relative">
        <input
          value={value}
          disabled={isLoading}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Talk with Zecco.es"
          className="w-full rounded-xl border border-blue-300 bg-white px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg bg-sky_blue_color text-white hover:bg-blue-700 disabled:opacity-50"
          aria-label="close"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}


// "use client";

// import { ArrowUp, MapPin } from "lucide-react";
// import { useEffect, useRef, useState, useMemo } from "react";

// type LocationItem = {
//   id: string;
//   type: "city" | "area" | "subarea";
//   name: string;
//   city_name: string;
//   area_name: string | null;
//   subarea_name: string | null;
// };

// type Props = {
//   isLoading: boolean;
//   onSend: (text: string) => void;
//   locationList?: LocationItem[]; 
// };

// // Conversational filler words that break location matching sequences
// const FILLER_WORDS = new Set([
//   "can", "you", "show", "find", "want", "look", "looking", "for", "with",
//   "house", "villa", "home", "apartment", "property", "rent", "buy", "sale",
//   "the", "this", "that", "here", "there", "some", "near", "close", "bello", "to", "of", "a", "in"
// ]);

// export default function ChatInput({ isLoading, onSend, locationList = [] }: Props) {
//   const [value, setValue] = useState("");
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Dynamically extract the full trailing location phrase from the sentence
//   const searchConfig = useMemo(() => {
//     if (!value.trim()) return { searchPhrase: "", wordCountToReplace: 0 };

//     const rawWords = value.split(/\s+/);
//     // Strip punctuation to clean up text tracking
//     const cleanWords = rawWords.map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase());
    
//     let locationWords: string[] = [];
    
//     // Scan backwards from the very last word typed
//     for (let i = cleanWords.length - 1; i >= 0; i--) {
//       const word = cleanWords[i];
      
//       // Stop accumulating immediately if we hit a conversational filler word or empty space
//       if (!word || FILLER_WORDS.has(word) || word.length < 1) {
//         break;
//       }
      
//       // Add the valid word to the front of our location string accumulator
//       locationWords.unshift(word);
//     }

//     const searchPhrase = locationWords.join(" ");

//     // Ensure the phrase is at least 2 characters long to avoid single-letter noise
//     if (searchPhrase.length < 2) {
//       return { searchPhrase: "", wordCountToReplace: 0 };
//     }

//     return {
//       searchPhrase,
//       wordCountToReplace: locationWords.length // Tracks exactly how many words to erase later
//     };
//   }, [value]);

//   // Filter list strictly using the accumulated trailing location phrase
//   const filteredSuggestions = useMemo(() => {
//     const { searchPhrase } = searchConfig;
//     if (!searchPhrase) return [];

//     return locationList
//       .filter((loc) => {
//         const nameLower = loc.name.toLowerCase();
//         const cityLower = loc.city_name?.toLowerCase() || "";
//         const areaLower = loc.area_name?.toLowerCase() || "";
//         const subareaLower = loc.subarea_name?.toLowerCase() || "";

//         // Check if the accumulated phrase matches any available database properties
//         return nameLower.includes(searchPhrase) || 
//                cityLower.includes(searchPhrase) || 
//                areaLower.includes(searchPhrase) || 
//                subareaLower.includes(searchPhrase);
//       })
//       .sort((a, b) => {
//         // Prioritize items that begin directly with the typed string phrase
//         const aStarts = a.name.toLowerCase().startsWith(searchPhrase) ? 1 : 0;
//         const bStarts = b.name.toLowerCase().startsWith(searchPhrase) ? 1 : 0;
        
//         if (aStarts !== bStarts) return bStarts - aStarts;
        
//         // Secondary sort: shorter names match closer to user intent
//         return a.name.length - b.name.length;
//       })
//       .slice(0, 8); 
//   }, [searchConfig, locationList]);

//   useEffect(() => {
//     setActiveSuggestionIndex(-1);
//   }, [filteredSuggestions]);

//   const handleSend = (textToSend = value) => {
//     if (!textToSend.trim()) return;
//     onSend(textToSend);
//     setValue("");
//     setShowSuggestions(false);
//   };

//   // Replaces the dynamic N-word string chunk with the chosen recommendation item
//   const handleSelectSuggestion = (suggestion: LocationItem) => {
//     const words = value.split(/\s+/);
//     const { wordCountToReplace } = searchConfig;

//     if (words.length >= wordCountToReplace && wordCountToReplace > 0) {
//       // Erase exactly how many words formed the search phrase and insert the proper location name
//       words.splice(words.length - wordCountToReplace, wordCountToReplace, suggestion.name);
//       setValue(words.join(" ") + " "); // Extra space ready for the next word
//     } else {
//       setValue(suggestion.name + " ");
//     }

//     setShowSuggestions(false);
//     inputRef.current?.focus();
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     const hasSuggestions = showSuggestions && filteredSuggestions.length > 0;

//     if (hasSuggestions) {
//       if (e.key === "ArrowDown") {
//         e.preventDefault(); 
//         setActiveSuggestionIndex((prevIndex) => 
//           prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0
//         );
//       } else if (e.key === "ArrowUp") {
//         e.preventDefault(); 
//         setActiveSuggestionIndex((prevIndex) => 
//           prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1
//         );
//       } else if (e.key === "Enter") {
//         if (activeSuggestionIndex >= 0 && activeSuggestionIndex < filteredSuggestions.length) {
//           e.preventDefault();
//           handleSelectSuggestion(filteredSuggestions[activeSuggestionIndex]);
//         } else {
//           handleSend();
//         }
//       } else if (e.key === "Escape") {
//         setShowSuggestions(false);
//       }
//     } else {
//       if (e.key === "Enter") {
//         handleSend();
//       }
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
//         setShowSuggestions(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (!isLoading) {
//       inputRef.current?.focus();
//     }
//   }, [isLoading]);

//   return (
//     <div ref={containerRef} className="shrink-0 p-4 bg-[#F3F8FF] border-t border-blue-100 relative">
      
//       {/* Floating Suggestions Dropdown */}
//       {showSuggestions && filteredSuggestions.length > 0 && (
//         <div className="absolute left-4 right-4 bottom-full mb-2 max-h-60 overflow-y-auto rounded-xl border border-blue-100 bg-white shadow-lg z-50 py-1">
//           {filteredSuggestions.map((suggestion, index) => {
//             const isActive = index === activeSuggestionIndex;
//             return (
//               <button
//                 key={suggestion.id}
//                 type="button"
//                 onClick={() => handleSelectSuggestion(suggestion)}
//                 className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors border-b border-gray-50 last:border-b-0 ${
//                   isActive ? "bg-blue-100 text-blue-900 font-medium" : "hover:bg-blue-50 text-gray-800"
//                 }`}
//               >
//                 <MapPin size={14} className={isActive ? "text-blue-600 shrink-0" : "text-blue-400 shrink-0"} />
//                 <div className="truncate">
//                   <span>{suggestion.name}</span>
//                   {suggestion.type !== "city" && (
//                     <span className={`text-xs ml-2 italic ${isActive ? "text-blue-700" : "text-gray-400"}`}>
//                       ({suggestion.city_name})
//                     </span>
//                   )}
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       )}

//       {/* Input Box Setup */}
//       <div className="relative">
//         <input
//           ref={inputRef}
//           value={value}
//           disabled={isLoading}
//           onChange={(e) => {
//             setValue(e.target.value);
//             setShowSuggestions(true);
//           }}
//           onFocus={() => setShowSuggestions(true)}
//           onKeyDown={handleKeyDown}
//           placeholder="Talk with Zecco.es"
//           className="w-full rounded-xl border border-blue-300 bg-white px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={() => handleSend()}
//           disabled={isLoading}
//           className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg bg-sky_blue_color text-white hover:bg-blue-700 disabled:opacity-50"
//         >
//           <ArrowUp size={16} />
//         </button>
//       </div>
//     </div>
//   );
// }