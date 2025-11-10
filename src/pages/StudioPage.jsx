import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generationService } from '../services/generation.service';
import { postsService } from '../services/posts.service';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Sparkles, Wand2, RefreshCw, ScanFace, X, Image as ImageIcon, Video, ChevronDown, Dices, Volume2, Crown, Zap, Settings } from 'lucide-react';

const GeneratePage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [generatedMedia, setGeneratedMedia] = useState([]);
  const [jobId, setJobId] = useState(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishData, setPublishData] = useState({ title: '', description: '', tags: '' });
  const [inputMediaId, setInputMediaId] = useState(null);
  const [generationType, setGenerationType] = useState('image');
  const [imageRatio, setImageRatio] = useState('1:1');
  const [videoResolution, setVideoResolution] = useState('720p');
  const [videoLength, setVideoLength] = useState(4);
  const [videoAudio, setVideoAudio] = useState(false);
  const [memeMode, setMemeMode] = useState(false);
  const [imageQuality, setImageQuality] = useState('medium');
  const [showQualityDropdown, setShowQualityDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showRatioDropdown, setShowRatioDropdown] = useState(false);
  const [showResolutionDropdown, setShowResolutionDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('');

  // Mobile accordion states
  const [mobileSettingsExpanded, setMobileSettingsExpanded] = useState(false);

  // Desktop settings accordion
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  // Fetch models from API
  const [availableModels, setAvailableModels] = useState([]);
  const [imageModels, setImageModels] = useState([]);
  const [videoModels, setVideoModels] = useState([]);
  const [selectedCustomModel, setSelectedCustomModel] = useState(null);
  const [loadingModels, setLoadingModels] = useState(true);

  // All possible options (MeowVerse options)
  const allImageRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];
  const allVideoResolutions = ['720p', '1080p'];
  const allVideoLengths = [4, 6, 8, 10, 12];
  const allImageQualities = ['low', 'medium', 'high'];

  // Calculate credit cost dynamically
  const calculateCreditCost = () => {
    if (!selectedCustomModel) return 0;

    // For image models
    if (generationType === 'image') {
      let baseCost = selectedCustomModel.cost_credits || 0;

      // Apply quality multiplier if model supports quality tiers
      if (selectedCustomModel.supports_quality_tiers && imageQuality) {
        const qualityMultipliers = selectedCustomModel.quality_multipliers || {};
        const qualityMultiplier = qualityMultipliers[imageQuality] || 1.0;
        baseCost = Math.ceil(baseCost * qualityMultiplier);
      }

      return baseCost;
    }

    // For video models with per-second pricing
    if (selectedCustomModel.credits_per_second) {
      const creditsPerSecond = parseFloat(selectedCustomModel.credits_per_second);
      const duration = videoLength || 8;
      const resolution = videoResolution || '720p';

      // Get multipliers
      const multipliers = selectedCustomModel.resolution_multipliers || { '720p': 1.0, '1080p': 1.5 };
      const resolutionMultiplier = multipliers[resolution] || 1.0;

      // Audio multiplier (Veo models charge more for audio)
      let audioMultiplier = 1.0;
      if (videoAudio && selectedCustomModel.supports_audio && multipliers.audio_multiplier) {
        audioMultiplier = multipliers.audio_multiplier;
      }

      return Math.ceil(creditsPerSecond * duration * resolutionMultiplier * audioMultiplier);
    }

    // Fallback to base cost
    return selectedCustomModel.cost_credits || 0;
  };

  // Fetch available models on mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoadingModels(true);
        const response = await generationService.getModels();
        const models = response.data.models || [];

        setAvailableModels(models);

        // Separate image and video models
        const imgModels = models.filter(m => m.type === 'text-to-image' || m.capabilities?.type === 'image');
        const vidModels = models.filter(m => m.type === 'text-to-video' || m.capabilities?.type === 'video');

        setImageModels(imgModels);
        setVideoModels(vidModels);

        // Set initial selected model - prefer default models
        if (generationType === 'image' && imgModels.length > 0) {
          const defaultModel = imgModels.find(m => m.is_default);
          setSelectedCustomModel(defaultModel || imgModels[0]);
        } else if (generationType === 'video' && vidModels.length > 0) {
          const defaultModel = vidModels.find(m => m.is_default);
          setSelectedCustomModel(defaultModel || vidModels[0]);
        }
      } catch (error) {
        console.error('Failed to fetch models:', error);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, []);

  // Update selected model when generation type changes - prefer default models
  useEffect(() => {
    if (generationType === 'image' && imageModels.length > 0) {
      const defaultModel = imageModels.find(m => m.is_default);
      setSelectedCustomModel(defaultModel || imageModels[0]);
    } else if (generationType === 'video' && videoModels.length > 0) {
      const defaultModel = videoModels.find(m => m.is_default);
      setSelectedCustomModel(defaultModel || videoModels[0]);
    }
  }, [generationType, imageModels, videoModels]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside dropdown menus
      if (!event.target.closest('.dropdown-container')) {
        setShowTypeDropdown(false);
        setShowModelDropdown(false);
        setShowRatioDropdown(false);
        setShowResolutionDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper functions to check if option is supported by selected model
  const isRatioSupported = (ratio) => {
    if (!selectedCustomModel?.capabilities?.supported_ratios) return true; // If no capabilities, allow all
    return selectedCustomModel.capabilities.supported_ratios.includes(ratio);
  };

  const isResolutionSupported = (resolution) => {
    if (!selectedCustomModel?.capabilities?.supported_resolutions) return true;
    return selectedCustomModel.capabilities.supported_resolutions.includes(resolution);
  };

  const isDurationSupported = (duration) => {
    if (!selectedCustomModel?.capabilities?.supported_durations) return true;
    return selectedCustomModel.capabilities.supported_durations.includes(duration);
  };

  // Get available options for current model
  const getAvailableRatios = () => {
    if (!selectedCustomModel?.capabilities?.supported_ratios) return allImageRatios;
    return allImageRatios.filter(isRatioSupported);
  };

  const getAvailableResolutions = () => {
    if (!selectedCustomModel?.capabilities?.supported_resolutions) return allVideoResolutions;
    return allVideoResolutions.filter(isResolutionSupported);
  };

  const getAvailableDurations = () => {
    if (!selectedCustomModel?.capabilities?.supported_durations) return allVideoLengths;
    return allVideoLengths.filter(isDurationSupported);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Image too large! Maximum size is 10MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, or GIF).');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:3000/api/upload/image', {
        method: 'POST',
        headers: user ? {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        } : {},
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setInputMediaId(data.mediaId);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setUploadedImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveUpload = () => {
    setUploadedImagePreview(null);
    setInputMediaId(null);
  };

  const handleRandomPrompt = () => {
    const randomPrompts = [
      "A majestic black cat with glowing eyes sitting on a throne in a gothic castle surrounded by candles",
      "Cyberpunk city street at night with neon signs and a cool cat wearing sunglasses walking confidently",
      "Underwater scene with a curious cat swimming among colorful tropical fish and vibrant coral reefs",
      "A cat astronaut floating gracefully in space near a stunning purple nebula and distant planets",
      "Magical forest with bioluminescent plants and a mystical cat with glowing fur exploring the enchanted woods",
      "Steampunk workshop filled with gears and copper pipes, a mechanical cat assistant working on inventions",
      "Ancient Egyptian temple with golden statues and a regal cat deity basking in rays of sunlight",
      "Cozy library with towering bookshelves, a wise cat wearing reading glasses studying an ancient tome",
      "Futuristic holographic interface with a sleek cyber cat analyzing glowing data streams",
      "Zen garden with cherry blossoms falling gently, a peaceful cat meditating by a koi pond at sunset",
      "Post-apocalyptic wasteland with ruins and dust, a survivor cat with a tattered scarf standing on rubble",
      "Fairy tale cottage in the woods with smoke from chimney, a friendly cat baking cookies by the window",
      "Northern lights dancing in the Arctic sky, a fluffy white cat sitting on an iceberg gazing at the aurora",
      "Victorian ball room with elegant dancers, a sophisticated cat in a tuxedo observing from a balcony",
      "Desert oasis with palm trees and turquoise water, an adventurous cat discovering ancient treasures in the sand",
      "A cat in a business suit aggressively typing on a tiny laptop during an important Zoom meeting",
      "A chubby orange cat stuck in a cardboard box labeled 'DANGER: UNSTABLE GENIUS INSIDE'",
      "A cat wearing a chef's hat cooking a gourmet meal while three other cats judge silently from bar stools",
      "A dramatic cat standing on a cliff edge with wind blowing its fur, contemplating life's biggest mystery: the red dot",
      "A cat riding a roomba like a noble steed, charging into battle against a confused dog",
      "A majestic cat wearing a tiny crown sitting on a throne made entirely of empty tuna cans",
      "A cat therapist with glasses taking notes while another cat lays on a tiny therapy couch complaining",
      "A noir detective cat in a fedora and trench coat investigating the mysterious case of the missing treats",
      "A cat DJ with headphones spinning records at an underground rave full of glowstick-waving kittens",
      "A superhero cat in a cape dramatically posing on a rooftop while pigeons scatter in fear",
      "A cat wearing sunglasses and a leather jacket riding a motorcycle through the desert at sunset",
      "A grumpy Persian cat getting a spa day with cucumber slices on eyes and a tiny towel turban",
      "A cat scientist in a lab coat accidentally creating a portal to the treat dimension",
      "A wise old cat sensei teaching martial arts to young ninja kittens in a dojo",
      "A cat news anchor seriously reporting on breaking news: 'Local human still hasn't filled food bowl'",
      "A pirate cat captain with an eyepatch standing on a ship's bow searching for the legendary island of Infinite Catnip",
      "A cat rockstar shredding an electric guitar on stage with pyrotechnics and screaming fans",
      "A Victorian-era cat gentleman reading the newspaper while sipping tea from a tiny teacup, monocle in place",
      "A cat astronaut planting a flag on the moon that says 'NO DOGS ALLOWED'",
      "A cat wizard with a pointy hat and wand accidentally turning all the furniture into scratching posts"
    ];

    const randomIndex = Math.floor(Math.random() * randomPrompts.length);
    setPrompt(randomPrompts[randomIndex]);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    if (!user) {
      navigate('/register');
      return;
    }

    const requiredCredits = 5;
    if (user.credits < requiredCredits) {
      if (window.confirm('Get More Credits!')) {
        navigate('/credits');
      }
      return;
    }

    await generateImage();
  };

  const generateImage = async () => {
    setGenerating(true);
    setGeneratedImage(null);
    setGeneratedImageUrl(null);

    try {
      const response = await generationService.generateImage(
        selectedCustomModel?.id || 1, // Use actual model ID
        prompt,
        '',
        {
          generationType,
          model: selectedCustomModel?.name,
          ...(generationType === 'image' && {
            ratio: imageRatio,
            memeMode: memeMode
          }),
          ...(generationType === 'video' && {
            resolution: videoResolution,
            duration: parseInt(videoLength),
            audio: videoAudio
          })
        },
        inputMediaId
      );

      const newJobId = response.data.jobId || response.data.id;
      setJobId(newJobId);
      pollForCompletion(newJobId);
    } catch (error) {
      setGenerating(false);
      alert(error.response?.data?.error || 'Generation failed');
    }
  };

  const pollForCompletion = (jobId) => {
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await generationService.getJobStatus(jobId);
        const job = statusResponse.data.job || statusResponse.data;

        if (job.status === 'completed') {
          clearInterval(pollInterval);
          setGeneratedImage(job);
          setGeneratedImageUrl(job.result_url || job.original_url);
          setGenerating(false);
          if (user) {
            await refreshUser();
          }
        } else if (job.status === 'failed') {
          clearInterval(pollInterval);
          alert('Generation failed: ' + (job.error_message || 'Unknown error'));
          setGenerating(false);
          if (user) {
            await refreshUser();
          }
        }
      } catch (error) {
        clearInterval(pollInterval);
        console.error('Poll error:', error);
        setGenerating(false);
      }
    }, 2000);
  };

  const handlePublish = async () => {
    if (!publishData.title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      await postsService.createPost({
        media_id: generatedImage.id,
        title: publishData.title,
        description: publishData.description,
        tags: publishData.tags.split(',').map(t => t.trim()).filter(t => t)
      });

      alert('✅ Published successfully!');
      setShowPublishModal(false);
      setPublishData({ title: '', description: '', tags: '' });
      navigate('/');
    } catch (error) {
      alert('Failed to publish: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleModifyImage = () => {
    if (!generatedImage) return;
    
    setInputMediaId(generatedImage.id);
    setUploadedImagePreview(generatedImageUrl);
    setPrompt('');
    setGeneratedImage(null);
    setGeneratedImageUrl(null);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-6xl font-black mb-4 leading-tight">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Make Meowments
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your imagination into reality
            </p>
          </div>

          {/* Free Credits Banner */}
          {!user && (
            <div className="mb-4 backdrop-blur-xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl border border-purple-500/10 p-6 text-center">
              <div className="text-3xl mb-3">🎁</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Register to Get 50 Free Credits!
              </h3>
              <p className="text-gray-300 text-md">
                Create and share your best Meowments or your coolest MeowMe! 😸
              </p>
            </div>
          )}

          {/* Main Control Panel */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-slate-800/40 to-purple-900/20 rounded-3xl border border-purple-500/20 shadow-2xl">
            {/* Input Area */}
            <div className="px-3 pt-3 pb-1">
              {/* Uploaded Image Preview */}
              {uploadedImagePreview && (
                <div className="mb-6 relative group">
                  <div className="relative inline-block">
                    <img 
                      src={uploadedImagePreview} 
                      alt="Reference" 
                      className="h-32 rounded-2xl object-cover border-2 border-purple-500/50 shadow-lg"
                    />
                    <button
                      onClick={handleRemoveUpload}
                      className="absolute -top-3 -right-3 p-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-full text-white transition-all shadow-lg hover:scale-110"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Prompt Textarea */}
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`✨ Describe your dream ${generationType}...\nFor example: "A black cat wearing a wizard hat in a magical forest..."`}
                  className="w-full h-40 md:h-40 bg-slate-900/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-2xl p-5 md:p-6 pr-16 md:pr-20 text-white text-base md:text-lg placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 resize-none transition-all"
                  style={{ lineHeight: '1.6' }}
                />

                {/* Random Prompt Button - Bottom Left */}
                <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6">
                  <button
                    onClick={handleRandomPrompt}
                    className="group flex items-center justify-center w-9 h-9 md:w-9 md:h-9 bg-gradient-to-r from-purple-600/60 to-pink-600/60 hover:from-purple-500/60 hover:to-pink-500/60 rounded-xl transition-all shadow-lg hover:shadow-purple-500/50 hover:scale-110"
                    title="Generate random prompt idea"
                  >
                    <Dices className="w-5 h-5 md:w-5 md:h-5 text-white group-hover:rotate-12 transition-transform" />
                  </button>
                </div>

                {/* Upload Button - Bottom Right */}
                <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer group flex items-center justify-center w-9 h-9 md:w-9 md:h-9 bg-gradient-to-r from-purple-600/60 to-pink-600/60 hover:from-purple-500/60 hover:to-pink-500/60 rounded-xl transition-all shadow-lg hover:shadow-purple-500/50 hover:scale-110"
                    title="Upload reference image"
                  >
                    <ImageIcon className="w-5 h-5 md:w-5 md:h-5 text-white group-hover:rotate-12 transition-transform" />
                  </label>
                </div>
              </div>
            </div>

            {/* Control Bar */}
            <div className="border-t border-purple-500/20 px-4 py-4 bg-slate-900/30 rounded-b-3xl">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                {/* Mobile Layout */}
                <div className="md:hidden flex flex-col gap-3">
                  {/* Type Selector */}
                  <div>
                    <div className="flex p-1 bg-gradient-to-r from-purple-700/60 to-purple-600/60 rounded-xl border border-purple-500/20">
                      <button
                        onClick={() => setGenerationType('image')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all ${
                          generationType === 'image'
                            ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Image</span>
                      </button>
                      <button
                        onClick={() => setGenerationType('video')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all ${
                          generationType === 'video'
                            ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        <span>Video</span>
                      </button>
                    </div>
                  </div>

                  {/* Audio Toggle (Video only) */}
                  {generationType === 'video' && selectedCustomModel?.supports_audio && (() => {
                    const hasAudioMultiplier = selectedCustomModel?.resolution_multipliers?.audio_multiplier;
                    const isAlwaysOn = !hasAudioMultiplier;

                    return (
                      <div>
                        <button
                          onClick={() => {
                            if (!isAlwaysOn) {
                              setVideoAudio(!videoAudio);
                            }
                          }}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all shadow-md ${
                            isAlwaysOn || videoAudio
                              ? 'bg-gradient-to-r from-purple-600/60 to-pink-600/60 text-white cursor-default'
                              : 'bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-slate-600/60 hover:to-slate-500/60 text-gray-300 cursor-pointer'
                          } ${isAlwaysOn ? 'opacity-90' : ''}`}
                          title={isAlwaysOn ? 'Audio always included' : (videoAudio ? 'Audio enabled' : 'Audio disabled')}
                        >
                          <Volume2 className="w-5 h-5" />
                          <span>Audio {isAlwaysOn && <span className="text-xs opacity-75">(Always On)</span>}</span>
                        </button>
                      </div>
                    );
                  })()}

                  {/* Meme Mode Toggle (Image only) */}
                  {generationType === 'image' && (
                    <div>
                      <button
                        onClick={() => setMemeMode(!memeMode)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all shadow-md ${
                          memeMode
                            ? 'bg-gradient-to-r from-purple-600/60 to-pink-600/60 text-white'
                            : 'bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-slate-600/60 hover:to-slate-500/60 text-gray-300 cursor-pointer'
                        }`}
                        title={memeMode ? 'Meme mode enabled' : 'Meme mode disabled'}
                      >
                        <ScanFace className="w-5 h-5" />
                        <span>Meme Mode</span>
                      </button>
                    </div>
                  )}

                  {/* Advanced Settings Button */}
                  <button
                    onClick={() => setMobileSettingsExpanded(!mobileSettingsExpanded)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-700/60 to-purple-600/60 hover:from-purple-600/60 hover:to-purple-500/60 text-white rounded-xl font-medium transition-all shadow-md"
                  >
                    <Settings className={`w-5 h-5 transition-transform duration-300 ${mobileSettingsExpanded ? 'rotate-180' : 'rotate-0'}`} />
                    <span>Settings</span>
                  </button>

                  {/* Mobile Collapsible Settings */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileSettingsExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col gap-3">
                      {/* Model Selector */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-2 font-medium">Model</label>
                        {generationType === 'image' && (
                          <div className="grid grid-cols-3 gap-2">
                            {imageModels.map((model) => (
                              <button
                                key={model.id}
                                onClick={() => setSelectedCustomModel(model)}
                                className={`px-3 py-2 rounded-xl text-sm font-regular transition-all ${
                                  selectedCustomModel?.id === model.id
                                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                                    : 'bg-gradient-to-r from-purple-700/60 to-purple-600/60 text-white hover:from-purple-600/60 hover:to-purple-500/60 border border-purple-500/20'
                                }`}
                              >
                                <div className="truncate">{model.display_name}</div>
                              </button>
                            ))}
                          </div>
                        )}
                        {generationType === 'video' && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                              {videoModels.filter(m =>
                                m.name === 'veo-3.1-fast-generate-preview' ||
                                m.name === 'sora-2' ||
                                m.name === 'seedance-1-0-pro-fast-251015'
                              ).map((model) => (
                                <button
                                  key={model.id}
                                  onClick={() => setSelectedCustomModel(model)}
                                  className={`px-2 py-2 rounded-xl text-sm font-regular transition-all ${
                                    selectedCustomModel?.id === model.id
                                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                                      : 'bg-gradient-to-r from-purple-700/60 to-purple-600/60 text-white hover:from-purple-600/60 hover:to-purple-500/60 border border-purple-500/20'
                                  }`}
                                >
                                  <div className="truncate">{model.display_name}</div>
                                </button>
                              ))}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {videoModels.filter(m =>
                                m.name === 'veo-3.1-generate-preview' ||
                                m.name === 'sora-2-pro' ||
                                m.name === 'seedance-1-0-pro-250528'
                              ).map((model) => (
                                <button
                                  key={model.id}
                                  onClick={() => setSelectedCustomModel(model)}
                                  className={`px-2 py-2 rounded-xl text-sm font-regular transition-all ${
                                    selectedCustomModel?.id === model.id
                                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                                      : 'bg-gradient-to-r from-purple-700/60 to-purple-600/60 text-white hover:from-purple-600/60 hover:to-purple-500/60 border border-purple-500/20'
                                  }`}
                                >
                                  <div className="truncate">{model.display_name}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Ratio / Resolution */}
                      {generationType === 'image' ? (
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 font-medium">Ratio</label>
                          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                            <div className="flex gap-2 pb-2">
                              {allImageRatios.map((ratio) => {
                                const isSupported = isRatioSupported(ratio);
                                return (
                                  <button
                                    key={ratio}
                                    onClick={() => isSupported && setImageRatio(ratio)}
                                    disabled={!isSupported}
                                    className={`flex-shrink-0 px-4 py-1 rounded-xl font-medium transition-all whitespace-nowrap ${
                                      imageRatio === ratio
                                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                                        : isSupported
                                          ? 'bg-gradient-to-r from-purple-700/60 to-purple-600/60 text-white hover:from-purple-600/60 hover:to-purple-500/60 border border-purple-500/20'
                                          : 'bg-slate-800/30 text-gray-600 opacity-50 cursor-not-allowed'
                                    }`}
                                  >
                                    {ratio}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 font-medium">Resolution</label>
                          <div className="flex gap-2">
                            {allVideoResolutions.map((res) => {
                              const isSupported = isResolutionSupported(res);
                              return (
                                <button
                                  key={res}
                                  onClick={() => isSupported && setVideoResolution(res)}
                                  disabled={!isSupported}
                                  className={`flex-1 px-4 py-1 rounded-xl font-medium transition-all ${
                                    videoResolution === res
                                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                                      : isSupported
                                        ? 'bg-gradient-to-r from-purple-700/60 to-purple-600/60 text-white hover:from-purple-600/60 hover:to-purple-500/60 border border-purple-500/20'
                                        : 'bg-slate-800/30 text-gray-600 opacity-50 cursor-not-allowed'
                                  }`}
                                >
                                  {res}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Quality */}
                      {generationType === 'image' && selectedCustomModel?.supports_quality_tiers && (
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 font-medium">Quality</label>
                          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                            <div className="flex gap-2 pb-2">
                              {Object.keys(selectedCustomModel.quality_multipliers || {}).map((quality) => {
                                const isCreatorOnly = (quality === 'high' && selectedCustomModel.name === 'gpt-image-1') ||
                                                     (quality === '4k' && selectedCustomModel.name === 'seedream-4-0-250828');
                                const canUse = !isCreatorOnly || user?.subscription_tier === 'creator';
                                const multiplier = selectedCustomModel.quality_multipliers[quality];
                                const credits = Math.ceil(selectedCustomModel.cost_credits * multiplier);

                                return (
                                  <button
                                    key={quality}
                                    onClick={() => {
                                      if (!canUse) {
                                        setUpgradeFeature(quality === '4k' ? '4K Quality' : 'High Quality');
                                        setShowUpgradeModal(true);
                                        return;
                                      }
                                      setImageQuality(quality);
                                    }}
                                    className={`flex-shrink-0 px-4 py-1 rounded-xl font-medium transition-all whitespace-nowrap ${
                                      imageQuality === quality
                                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                                        : canUse
                                          ? 'bg-gradient-to-r from-purple-700/60 to-purple-600/60 text-white hover:from-purple-600/60 hover:to-purple-500/60 border border-purple-500/20'
                                          : 'bg-slate-800/30 text-gray-600 opacity-50 cursor-pointer hover:opacity-70'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="capitalize">{quality === '4k' ? '4K' : quality}</span>
                                      {isCreatorOnly && <Crown className="w-3.5 h-3.5 text-yellow-400" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Duration */}
                      {generationType === 'video' && (
                        <div>
                          <label className="block text-xs text-gray-400 mb-2 font-medium">Duration</label>
                          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                            <div className="flex gap-2 pb-2">
                              {allVideoLengths.map((duration) => {
                                const isSupported = isDurationSupported(duration);
                                return (
                                  <button
                                    key={duration}
                                    onClick={() => isSupported && setVideoLength(duration)}
                                    disabled={!isSupported}
                                    className={`flex-shrink-0 px-4 py-1 rounded-xl font-medium transition-all whitespace-nowrap ${
                                      videoLength === duration
                                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                                        : isSupported
                                          ? 'bg-gradient-to-r from-purple-700/60 to-purple-600/60 text-white hover:from-purple-600/60 hover:to-purple-500/60 border border-purple-500/20'
                                          : 'bg-slate-800/30 text-gray-600 opacity-50 cursor-not-allowed'
                                    }`}
                                  >
                                    {duration}s
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop: Type Selector */}
                <div className="hidden md:block relative dropdown-container">
                  <button
                    onClick={() => {
                      setShowTypeDropdown(!showTypeDropdown);
                      setShowModelDropdown(false);
                      setShowRatioDropdown(false);
                      setShowResolutionDropdown(false);
                      setShowQualityDropdown(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-700/50 to-purple-600/50 hover:from-purple-600/50 hover:to-purple-500/50 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    {generationType === 'image' ? <ImageIcon className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    <span>{generationType === 'image' ? 'Image' : 'Video'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showTypeDropdown && (
                    <div className="absolute bottom-full mb-2 left-0 bg-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl z-10 min-w-[125px] overflow-hidden">
                      <button
                        onClick={() => {
                          setGenerationType('image');
                          setShowTypeDropdown(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 hover:bg-purple-600/30 text-white transition-all"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span className="font-medium">Image</span>
                      </button>
                      <button
                        onClick={() => {
                          setGenerationType('video');
                          setShowTypeDropdown(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 hover:bg-purple-600/30 text-white transition-all"
                      >
                        <Video className="w-4 h-4" />
                        <span className="font-medium">Video</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Desktop: Audio Toggle (Video only) */}
                {generationType === 'video' && selectedCustomModel?.supports_audio && (() => {
                  const hasAudioMultiplier = selectedCustomModel?.resolution_multipliers?.audio_multiplier;
                  const isAlwaysOn = !hasAudioMultiplier;

                  return (
                    <button
                      onClick={() => {
                        if (!isAlwaysOn) {
                          setVideoAudio(!videoAudio);
                        }
                      }}
                      className={`hidden md:flex items-center gap-1 px-4 py-2 rounded-xl font-medium transition-all shadow-md ${
                        isAlwaysOn || videoAudio
                          ? 'bg-gradient-to-r from-purple-600/60 to-pink-600/60 text-white cursor-default'
                          : 'bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-slate-600/60 hover:to-slate-500/60 text-gray-300 cursor-pointer'
                      } ${isAlwaysOn ? 'opacity-90' : ''}`}
                      title={isAlwaysOn ? 'Audio always included' : (videoAudio ? 'Audio enabled' : 'Audio disabled')}
                    >
                      <Volume2 className="w-5 h-5" />
                      <span>Audio {isAlwaysOn && <span className="text-xs opacity-75">(Always On)</span>}</span>
                    </button>
                  );
                })()}

                {/* Desktop: Meme Mode Toggle (Image only) */}
                {generationType === 'image' && (
                  <button
                    onClick={() => setMemeMode(!memeMode)}
                    className={`hidden md:flex items-center gap-1 px-4 py-2 rounded-xl font-medium transition-all shadow-md ${
                      memeMode
                        ? 'bg-gradient-to-r from-purple-600/60 to-pink-600/60 text-white'
                        : 'bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-slate-600/60 hover:to-slate-500/60 text-gray-300 cursor-pointer'
                    }`}
                    title={memeMode ? 'Meme mode enabled' : 'Meme mode disabled'}
                  >
                    <ScanFace className="w-5 h-5" />
                    <span>Meme Mode</span>
                  </button>
                )}

                {/* Desktop: Settings Container */}
                <div className="hidden md:flex md:ml-auto">
                  {/* Collapsible Controls - Slide from right */}
                  <div className={`flex items-center gap-2 overflow-visible transition-all duration-300 ease-in-out ${settingsExpanded ? 'max-w-[1000px] opacity-100 mr-2' : 'max-w-0 opacity-0'}`}>

                    {/* Model Selector */}
                    <div className="relative dropdown-container">
                      <button
                        onClick={() => {
                          setShowModelDropdown(!showModelDropdown);
                          setShowTypeDropdown(false);
                          setShowRatioDropdown(false);
                          setShowResolutionDropdown(false);
                          setShowQualityDropdown(false);
                          setShowDurationDropdown(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-700/60 to-purple-600/60 hover:from-purple-600/60 hover:to-purple-500/60 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg max-w-[240px]"
                      >
                        <span className="truncate">{selectedCustomModel?.display_name}</span>
                        <ChevronDown className="w-4 h-4 flex-shrink-0" />
                      </button>

                      {showModelDropdown && (
                        <div className="absolute bottom-full mb-2 left-0 bg-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl z-20 max-h-72 overflow-y-auto min-w-[220px]">
                          {(generationType === 'image' ? imageModels : videoModels).map((model, idx) => (
                            <button
                              key={model.id}
                              onClick={() => {
                                setSelectedCustomModel(model);
                                setShowModelDropdown(false);
                              }}
                              className={`w-full px-4 py-2 hover:bg-purple-600/30 text-left transition-all ${idx === 0 ? 'rounded-t-xl' : ''} ${idx === (generationType === 'image' ? imageModels : videoModels).length - 1 ? 'rounded-b-xl' : ''}`}
                            >
                              <p className="text-white font-medium">{model.display_name}</p>
                              <p className="text-gray-400 text-sm">{model.provider}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Ratio (Image) / Resolution (Video) Selector */}
                    {generationType === 'image' ? (
                      <div className="relative dropdown-container">
                        <button
                          onClick={() => {
                            setShowRatioDropdown(!showRatioDropdown);
                            setShowTypeDropdown(false);
                            setShowModelDropdown(false);
                            setShowResolutionDropdown(false);
                            setShowQualityDropdown(false);
                            setShowDurationDropdown(false);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-700/60 to-purple-600/60 hover:from-purple-600/60 hover:to-purple-500/60 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                        >
                          <span>{imageRatio}</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>

                        {showRatioDropdown && (
                          <div className="absolute bottom-full mb-2 left-0 bg-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl z-20 min-w-[100px] overflow-hidden">
                            {allImageRatios.map((option, idx, arr) => {
                              const isSupported = isRatioSupported(option);
                              return (
                                <button
                                  key={option}
                                  onClick={() => {
                                    if (!isSupported) return;
                                    setImageRatio(option);
                                    setShowRatioDropdown(false);
                                  }}
                                  disabled={!isSupported}
                                  className={`w-full px-4 py-2 text-left transition-all ${idx === 0 ? 'rounded-t-xl' : ''} ${idx === arr.length - 1 ? 'rounded-b-xl' : ''} ${
                                    isSupported
                                      ? 'hover:bg-purple-600/30 text-white cursor-pointer'
                                      : 'text-gray-500 cursor-not-allowed opacity-50'
                                  }`}
                                >
                                  <span className="flex items-center justify-between">
                                    <span>{option}</span>
                                    {!isSupported && <span className="text-xs ml-2">✕</span>}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative dropdown-container">
                        <button
                          onClick={() => {
                            setShowResolutionDropdown(!showResolutionDropdown);
                            setShowTypeDropdown(false);
                            setShowModelDropdown(false);
                            setShowRatioDropdown(false);
                            setShowQualityDropdown(false);
                            setShowDurationDropdown(false);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-700/60 to-purple-600/60 hover:from-purple-600/60 hover:to-purple-500/60 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                        >
                          <span>{videoResolution}</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>

                        {showResolutionDropdown && (
                          <div className="absolute bottom-full mb-2 left-0 bg-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl z-20 min-w-[100px] overflow-hidden">
                            {allVideoResolutions.map((option, idx, arr) => {
                              const isSupported = isResolutionSupported(option);
                              return (
                                <button
                                  key={option}
                                  onClick={() => {
                                    if (!isSupported) return;
                                    setVideoResolution(option);
                                    setShowResolutionDropdown(false);
                                  }}
                                  disabled={!isSupported}
                                  className={`w-full px-4 py-2 text-left transition-all ${idx === 0 ? 'rounded-t-xl' : ''} ${idx === arr.length - 1 ? 'rounded-b-xl' : ''} ${
                                    isSupported
                                      ? 'hover:bg-purple-600/30 text-white cursor-pointer'
                                      : 'text-gray-500 cursor-not-allowed opacity-50'
                                  }`}
                                >
                                  <span className="flex items-center justify-between">
                                    <span>{option}</span>
                                    {!isSupported && <span className="text-xs ml-2">✕</span>}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quality Selector (Image only, for models with quality tiers) */}
                    {generationType === 'image' && selectedCustomModel?.supports_quality_tiers && (
                      <div className="relative dropdown-container">
                        <button
                          onClick={() => {
                            setShowQualityDropdown(!showQualityDropdown);
                            setShowTypeDropdown(false);
                            setShowModelDropdown(false);
                            setShowRatioDropdown(false);
                            setShowResolutionDropdown(false);
                            setShowDurationDropdown(false);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-700/60 to-purple-600/60 hover:from-purple-600/60 hover:to-purple-500/60 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                        >
                          <span className="capitalize">{imageQuality === '4k' ? '4K' : imageQuality}</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>

                        {showQualityDropdown && (
                          <div className="absolute bottom-full mb-2 left-0 bg-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl z-20 min-w-[140px] overflow-hidden">
                            {Object.keys(selectedCustomModel.quality_multipliers || {}).map((quality, idx, arr) => {
                              const isCreatorOnly = (quality === 'high' && selectedCustomModel.name === 'gpt-image-1') ||
                                                   (quality === '4k' && selectedCustomModel.name === 'seedream-4-0-250828');
                              const canUse = !isCreatorOnly || user?.subscription_tier === 'creator';
                              const multiplier = selectedCustomModel.quality_multipliers[quality];
                              const credits = Math.ceil(selectedCustomModel.cost_credits * multiplier);

                              return (
                                <button
                                  key={quality}
                                  onClick={() => {
                                    if (!canUse) {
                                      setUpgradeFeature(quality === '4k' ? '4K Quality' : 'High Quality');
                                      setShowUpgradeModal(true);
                                      return;
                                    }
                                    setImageQuality(quality);
                                    setShowQualityDropdown(false);
                                  }}
                                  className={`w-full px-4 py-2 text-left transition-all ${idx === 0 ? 'rounded-t-xl' : ''} ${idx === arr.length - 1 ? 'rounded-b-xl' : ''} ${
                                    canUse
                                      ? 'hover:bg-purple-600/30 text-white cursor-pointer'
                                      : 'text-gray-500 cursor-not-allowed opacity-50'
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="capitalize">{quality === '4k' ? '4K' : quality}</span>
                                    {isCreatorOnly && <Crown className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Duration Selector (Video only) */}
                    {generationType === 'video' && (
                      <div className="relative dropdown-container">
                        <button
                          onClick={() => {
                            setShowDurationDropdown(!showDurationDropdown);
                            setShowTypeDropdown(false);
                            setShowModelDropdown(false);
                            setShowRatioDropdown(false);
                            setShowResolutionDropdown(false);
                            setShowQualityDropdown(false);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-700/60 to-purple-600/60 hover:from-purple-600/60 hover:to-purple-500/60 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                        >
                          <span>{videoLength}s</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>

                        {showDurationDropdown && (
                          <div className="absolute bottom-full mb-2 left-0 bg-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl z-20 min-w-[100px] overflow-hidden">
                            {allVideoLengths.map((option, idx, arr) => {
                              const isSupported = isDurationSupported(option);
                              return (
                                <button
                                  key={option}
                                  onClick={() => {
                                    if (!isSupported) return;
                                    setVideoLength(option);
                                    setShowDurationDropdown(false);
                                  }}
                                  disabled={!isSupported}
                                  className={`w-full px-4 py-2 text-left transition-all ${idx === 0 ? 'rounded-t-xl' : ''} ${idx === arr.length - 1 ? 'rounded-b-xl' : ''} ${
                                    isSupported
                                      ? 'hover:bg-purple-600/30 text-white cursor-pointer'
                                      : 'text-gray-500 cursor-not-allowed opacity-50'
                                  }`}
                                >
                                  <span className="flex items-center justify-between">
                                    <span>{option}s</span>
                                    {!isSupported && <span className="text-xs ml-2">✕</span>}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Gear Icon Button */}
                  <button
                    onClick={() => setSettingsExpanded(!settingsExpanded)}
                    className="p-2.5 bg-gradient-to-r from-purple-700/60 to-purple-600/60 hover:from-purple-600/60 hover:to-purple-500/60 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    <Settings className={`w-5 h-5 transition-transform duration-300 ${settingsExpanded ? 'rotate-180' : 'rotate-0'}`} />
                  </button>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
                className={`w-full mt-4 py-2 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  generating || !prompt.trim()
                    ? 'bg-slate-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                }`}
              >
                {generating ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    <span>Generate</span>
                    <span className="flex items-center gap-1 text-yellow-300">
                      • {calculateCreditCost()} <Zap className="w-4 h-4" />
                    </span>
                  </div>
                )}
              </button>
            </div>

            {/* Results Section */}
            {generatedMedia.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold gradient-text">Your Creations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedMedia.map((item, index) => (
                    <div key={index} className="relative group">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={`Generated ${index + 1}`}
                          className="w-full h-64 object-cover rounded-xl"
                        />
                      ) : (
                        <video
                          src={item.url}
                          controls
                          className="w-full h-64 object-cover rounded-xl"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Modal */}
        <Modal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          title={`Unlock ${upgradeFeature}`}
        >
          <div className="space-y-6">
            {/* Feature Description */}
            <div className="text-center space-y-2">
              <p className="text-gray-300">
                {upgradeFeature} is available exclusively for Creator tier members.
              </p>
              <p className="text-gray-400 text-sm">
                Upgrade now to unlock premium features and enhanced capabilities!
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  navigate('/subscription');
                }}
                className="w-full py-3 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:scale-[1.02]"
              >
                Upgrade to Creator
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-3 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 font-medium rounded-xl transition-all"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default GeneratePage;
