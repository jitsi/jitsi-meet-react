package org.jitsi.jitsi_meet_react;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactRootView;

public class MainActivity extends ReactActivity {

    /**
     * The log tag used in MainActivity class.
     */
    private final static String TAG = MainActivity.class.getCanonicalName();

    /**
     * Holds the url passed as an argument of the ACTION_VIEW intent.
     */
    private String url = null;

    protected void onCreate(Bundle savedInstanceState) {
        Intent intent = getIntent();
        if (Intent.ACTION_VIEW.equals(intent.getAction())) {
            // On ACTION_VIEW intent there should be a link provided in
            // the Intent's data. Passing whatever value has been specified in
            // order to eventually react with an error on the JS side if it's
            // invalid.
            this.url = String.valueOf(intent.getData());
            Log.d(TAG, "ACTION_VIEW URL: " + this.url);
        }
        // Execute 'super' after the processing, otherwise 'getLanuchOptions'
        // will be called before the 'url' field is set
        super.onCreate(savedInstanceState);
    }

    /**
     * Overrides parent method in order to provide the URL in the 'initialProps'
     * passed by React Native to the app.
     *
     * @return a <tt>Bundle</tt> which will contain 'url' property if this
     * instance has been started by the ACTION_VIEW intent.
     */
    @Override
    protected Bundle getLaunchOptions() {
        Bundle bundle = super.getLaunchOptions();
        if (bundle == null) {
            bundle = new Bundle();
        }
        if (this.url != null) {
            bundle.putCharSequence("url", this.url);
        }
        return bundle;
    }

    /**
     * {@inheritDoc}
     *
     * Overrides {@link ReactActivity#createRootView()} to customize the
     * {@link ReactRootView} with a background color that is in accord with the
     * JavaScript and iOS parts of the application and causes less perceived
     * visual flicker than the default background color.
     */
    @Override
    protected ReactRootView createRootView() {
        ReactRootView rootView = super.createRootView();

        rootView.setBackgroundColor(0xFF111111);

        return rootView;
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "App";
    }
}
