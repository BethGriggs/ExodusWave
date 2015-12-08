// Make the slider   
var slider = document.getElementById('slider');

        noUiSlider.create(slider, {
            start: [1960, 2000],
            step: 10,
            connect: true,
            range: {
                'min': 1960,
                'max': 2000
            },
            pips: { // Show a scale with the slider
                mode: 'steps',
                density: 2
            }

        });