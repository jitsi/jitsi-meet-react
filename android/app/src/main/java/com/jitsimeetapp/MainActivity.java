package com.jitsimeetapp;

import java.util.Arrays;
import java.util.List;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactRootView;
import com.facebook.react.shell.MainReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.oney.WebRTCModule.WebRTCModulePackage;

public class MainActivity extends ReactActivity {

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
        return "JitsiMeetApp";
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return
	    Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new VectorIconsPackage(),
                    new WebRTCModulePackage());
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }
}
