import { useState, useRef, useCallback, useEffect } from "react";

interface UseVoiceReturn {
    isRecording: boolean;
    isSpeaking: boolean;
    startRecording: () => void;
    stopRecording: () => void;
    speak: (text: string) => Promise<void>;
    stopSpeaking: () => void;
    isSupported: boolean;
    error: string | null;
    transcript: string;
}

export function useVoice(): UseVoiceReturn {
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(false);
    const [transcript, setTranscript] = useState("");

    const recognitionRef = useRef<any>(null);
    const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const speechRecognitionSupported =
            'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        const speechSynthesisSupported = 'speechSynthesis' in window;

        setIsSupported(speechRecognitionSupported && speechSynthesisSupported);

        if (speechRecognitionSupported) {
            const SpeechRecognition =
                (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                console.log("✅ Recording started");
                setIsRecording(true);
                setTranscript("");
                setError(null);
            };

            recognitionRef.current.onend = () => {
                console.log("✅ Recording ended");
                setIsRecording(false);
            };

            recognitionRef.current.onresult = (event: any) => {
                console.log("✅ Got result");
                if (event.results && event.results.length > 0) {
                    const text = event.results[0][0].transcript;
                    console.log("Transcript:", text);
                    setTranscript(text);
                    setError(null);
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("❌ Error:", event.error);
                setIsRecording(false);

                let errorMessage = "Recognition error";
                switch (event.error) {
                    case 'no-speech':
                        errorMessage = "No speech detected. Please speak louder.";
                        break;
                    case 'audio-capture':
                        errorMessage = "Microphone not working.";
                        break;
                    case 'not-allowed':
                        errorMessage = "Microphone permission denied.";
                        break;
                    case 'network':
                        errorMessage = "Network error.";
                        break;
                    default:
                        errorMessage = `Error: ${event.error}`;
                }
                setError(errorMessage);
            };
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                    // Ignore
                }
            }
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const startRecording = useCallback(() => {
        console.log("🎤 Start recording");

        if (!isSupported) {
            setError("Voice not supported in this browser");
            return;
        }

        if (!recognitionRef.current) {
            setError("Speech recognition not initialized");
            return;
        }

        if (isRecording) {
            console.log("Already recording");
            return;
        }

        try {
            setTranscript("");
            setError(null);
            recognitionRef.current.start();
        } catch (err: any) {
            console.error("Error starting:", err);
            setError("Failed to start recording");
            setIsRecording(false);
        }
    }, [isSupported, isRecording]);

    const stopRecording = useCallback(() => {
        console.log("🛑 Stop recording");

        if (!recognitionRef.current) {
            return;
        }

        if (!isRecording) {
            console.log("Not recording");
            return;
        }

        try {
            recognitionRef.current.stop();
        } catch (err) {
            console.error("Error stopping:", err);
        }
    }, [isRecording]);

    const speak = useCallback(async (text: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!('speechSynthesis' in window)) {
                reject(new Error("Speech synthesis not supported"));
                return;
            }

            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            speechSynthesisRef.current = utterance;

            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(
                voice => voice.lang.startsWith('en') && voice.name.includes('Google')
            ) || voices.find(voice => voice.lang.startsWith('en'));

            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => {
                setIsSpeaking(false);
                speechSynthesisRef.current = null;
                resolve();
            };
            utterance.onerror = (event) => {
                // Don't log interrupted/cancelled errors - these are normal when user stops
                if (event.error === 'interrupted' || event.error === 'canceled') {
                    console.log("ℹ️ Speech stopped by user");
                    setIsSpeaking(false);
                    speechSynthesisRef.current = null;
                    resolve(); // Resolve instead of reject
                } else {
                    console.error("Speech error:", event);
                    setIsSpeaking(false);
                    speechSynthesisRef.current = null;
                    reject(new Error(`Speech error: ${event.error}`));
                }
            };

            setIsSpeaking(true);
            window.speechSynthesis.speak(utterance);
        });
    }, []);

    const stopSpeaking = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            speechSynthesisRef.current = null;
        }
    }, []);

    return {
        isRecording,
        isSpeaking,
        startRecording,
        stopRecording,
        speak,
        stopSpeaking,
        isSupported,
        error,
        transcript,
    };
}
