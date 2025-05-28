package com.azleep.urbanwhispers;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Toast;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private boolean doubleBackToExitPressedOnce = false;
    private long lastClickTime = 0;
    private static final long DOUBLE_CLICK_TIME_DELTA = 300; // milliseconds

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setupClickHandling();
    }

    private void setupClickHandling() {
        View contentView = findViewById(android.R.id.content);
        contentView.setOnClickListener(v -> handleClick());
    }

    private void handleClick() {
        long clickTime = System.currentTimeMillis();
        if (clickTime - lastClickTime < DOUBLE_CLICK_TIME_DELTA) {
            // Double click detected
            finishAndRemoveTask();
        }
        lastClickTime = clickTime;
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        // Handle both touch and mouse events
        if (ev.getAction() == MotionEvent.ACTION_DOWN) {
            handleClick();
        }
        return super.dispatchTouchEvent(ev);
    }

    @Override
    public void onBackPressed() {
        if (doubleBackToExitPressedOnce) {
            finishAndRemoveTask();
            return;
        }

        this.doubleBackToExitPressedOnce = true;
        Toast.makeText(this, "Double-click anywhere or press back again to exit", Toast.LENGTH_SHORT).show();

        new Handler(Looper.getMainLooper()).postDelayed(
            () -> doubleBackToExitPressedOnce = false, 
            2000
        );
    }
}
