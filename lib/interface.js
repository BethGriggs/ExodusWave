// Make the year slider   
var yearSlider = document.getElementById('year-slider');

        noUiSlider.create(yearSlider, {
            start: [1960, 1960],
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
