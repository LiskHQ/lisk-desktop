// https://angular-md-color.com

app.config(($mdThemingProvider) => {
  $mdThemingProvider.definePalette('customPrimary', {
    50: '#55c2fd',
    100: '#3cb9fd',
    200: '#23b0fd',
    300: '#09a7fd',
    400: '#0298ea',
    500: '#0288d1',
    600: '#0278b8',
    700: '#02679e',
    800: '#015785',
    900: '#01466c',
    A100: '#6ecbfe',
    A200: '#88d4fe',
    A400: '#a1ddfe',
    A700: '#013653',
    contrastDefaultColor: 'light',
  });

  $mdThemingProvider.definePalette('customAccent', {
    50: '#181b1c',
    100: '#24282a',
    200: '#303537',
    300: '#3c4245',
    400: '#474f53',
    500: '#535c60',
    600: '#6b767c',
    700: '#778389',
    800: '#849095',
    900: '#929ca1',
    A100: '#6b767c',
    A200: '#5f696e',
    A400: '#535c60',
    A700: '#a0a8ad',
  });

  $mdThemingProvider
    .theme('default')
    .primaryPalette('customPrimary')
    .accentPalette('customAccent');
});
