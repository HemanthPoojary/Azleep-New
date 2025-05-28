package com.azleepurbanwhispers.app;

import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "VoiceAssistant";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Log app start
        Log.d(TAG, "Voice Assistant initialized");

        // Add debug bridge for voice commands
        bridge.webView.evaluateJavascript(
            "(function() { " +
                "window.androidDebugLog = function(message) { " +
                    "console.log(message); " +
                    "window.bridge.postMessage('debug', message); " +
                "}; " +
            "})();",
            null
        );
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "Voice Assistant resumed");
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.d(TAG, "Voice Assistant paused");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "Voice Assistant destroyed");
    }
} 