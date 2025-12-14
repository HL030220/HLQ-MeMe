import React, { useState } from 'react';
import { Wand2, Smile, Zap, RefreshCcw, Type, Image as ImageIcon, Users } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { StickerResult } from './components/StickerResult';
import { Button } from './components/Button';
import { generateSticker } from './services/geminiService';
import { GenerationStatus } from './types';

const SUGGESTED_PROMPTS = [
  "Eating a giant burger happily",
  "Crying with waterfall tears",
  "Thumbs up with sparkling eyes",
  "Angry with fire background",
  "Confused with question marks",
  "Sleeping with a snot bubble"
];

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [subjectDescription, setSubjectDescription] = useState<string>('');
  const [useOriginalExpression, setUseOriginalExpression] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const finalPrompt = useOriginalExpression 
      ? "Keep the character's exact facial expression, emotion, and pose from the original image." 
      : prompt.trim();

    if (!selectedImage || !finalPrompt) return;

    setStatus(GenerationStatus.LOADING);
    setError(null);
    setResultImage(null); // Clear previous result to focus on new generation

    try {
      const stickerUrl = await generateSticker({
        base64Image: selectedImage,
        prompt: finalPrompt,
        subjectDescription: subjectDescription.trim()
      });
      setResultImage(stickerUrl);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setStatus(GenerationStatus.ERROR);
      setError("Something went wrong while generating the sticker. Please try again.");
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResultImage(null);
    setPrompt('');
    setSubjectDescription('');
    setUseOriginalExpression(false);
    setStatus(GenerationStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFD] text-gray-800 font-sans selection:bg-brand-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Smile className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Q-Meme Gen
            </h1>
          </div>
          <div className="hidden sm:flex items-center space-x-6 text-sm font-medium text-gray-500">
             <span className="flex items-center hover:text-brand-600 transition-colors cursor-default">
               <Zap className="w-4 h-4 mr-1 text-yellow-500" />
               Powered by Gemini 2.5
             </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Input Controls */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Step 1: Upload */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-gray-900 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold mr-3">1</span>
                  Upload Character
                </h2>
                {selectedImage && (
                  <button 
                    onClick={handleReset}
                    className="text-sm text-gray-400 hover:text-brand-500 flex items-center transition-colors"
                  >
                    <RefreshCcw className="w-3 h-3 mr-1" />
                    Reset
                  </button>
                )}
              </div>
              <ImageUploader 
                onImageSelect={setSelectedImage} 
                selectedImage={selectedImage}
                onClear={() => setSelectedImage(null)}
              />

              {selectedImage && (
                <div className="animate-in fade-in slide-in-from-top-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center mb-2 text-gray-700 font-medium text-sm">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Group photo?</span>
                    <span className="ml-1 text-gray-400 font-normal">(Optional)</span>
                  </div>
                  <input
                    type="text"
                    value={subjectDescription}
                    onChange={(e) => setSubjectDescription(e.target.value)}
                    placeholder="E.g., The boy in the blue shirt on the left"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Describe which character to transform if there are multiple people.
                  </p>
                </div>
              )}
            </section>

            {/* Step 2: Prompt */}
            <section className="space-y-4">
               <h2 className="text-xl font-display font-bold text-gray-900 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-bold mr-3">2</span>
                  Describe Emotion
                </h2>
              
              {/* Mode Toggle */}
              <div className="bg-gray-100 p-1 rounded-xl flex font-medium text-sm">
                <button
                  onClick={() => setUseOriginalExpression(false)}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-all ${
                    !useOriginalExpression 
                      ? 'bg-white text-gray-800 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Type className="w-4 h-4 mr-2" />
                  Custom Prompt
                </button>
                <button
                  onClick={() => setUseOriginalExpression(true)}
                  className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-all ${
                    useOriginalExpression 
                      ? 'bg-white text-gray-800 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Keep Original
                </button>
              </div>

              {/* Text Area & Suggestions */}
              <div className={`transition-opacity duration-300 ${useOriginalExpression ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={useOriginalExpression}
                    placeholder={useOriginalExpression ? "Using original expression from the image..." : "E.g., Drinking boba tea enthusiastically..."}
                    className="w-full h-32 p-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all resize-none text-lg disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  {!useOriginalExpression && (
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-medium bg-white px-2 py-1 rounded-md">
                      {prompt.length} chars
                    </div>
                  )}
                </div>

                {/* Suggestions */}
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Suggestions</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_PROMPTS.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPrompt(p)}
                        disabled={useOriginalExpression}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-brand-50 hover:text-brand-600 text-gray-600 rounded-lg text-xs font-medium transition-colors border border-transparent hover:border-brand-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {useOriginalExpression && (
                 <div className="p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 text-sm flex items-start animate-in fade-in slide-in-from-top-1">
                   <Smile className="w-5 h-5 mr-2 flex-shrink-0" />
                   <p>We'll create a cute Q-version sticker while keeping your character's exact current expression and pose!</p>
                 </div>
              )}
            </section>

            {/* Action */}
            <Button
              onClick={handleGenerate}
              disabled={!selectedImage || (!useOriginalExpression && !prompt) || status === GenerationStatus.LOADING}
              isLoading={status === GenerationStatus.LOADING}
              className="w-full text-lg py-4 shadow-brand-500/40"
              icon={<Wand2 className="w-5 h-5" />}
            >
              Generate Q-Meme
            </Button>
            
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-7 flex flex-col">
             <div className="flex items-center mb-8">
                <h2 className="text-xl font-display font-bold text-gray-900 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-600 text-sm font-bold mr-3">3</span>
                  Result
                </h2>
             </div>
             
             <div className="flex-1">
               <StickerResult 
                imageUrl={resultImage} 
                isLoading={status === GenerationStatus.LOADING} 
              />
             </div>
             
             {resultImage && (
               <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                 <h3 className="font-bold text-gray-800 mb-2">Tips for best results:</h3>
                 <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
                   <li>Upload a clear image where the character's face is visible.</li>
                   <li>For <strong>group photos</strong>, use the text box to specify which character to use.</li>
                   <li>Keep prompts simple describing an action or specific emotion.</li>
                 </ul>
               </div>
             )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;