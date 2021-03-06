import { changeBtnLable } from "js/utils/utils";
import * as siteParams from '@params';

export function handleReviewFrom() {
    if (!localStorage.getItem('review-version') || (localStorage.getItem('review-version') !== siteParams.site_version)) {
        $('.star')
            .on('mouseenter', starFocus)
            .on('mouseleave', starUnfocus)
            .on('click', sendReview)
    } else {
        if (localStorage.review) reviewed(parseInt(localStorage.review))
    }
}

function starFocus(event) {
    event.stopPropagation();
    colorStar( $(event.currentTarget).data('value') );
}

function starUnfocus() {
    $('.star').each((index, el) => { $(el).removeClass('is-hover') });
}

function sendReview(event) {
    event.preventDefault();
    const rate = $(event.currentTarget).data('value');
    if (!(parseInt(rate) <= 5)) return;
    $(`.star :input[value=${rate}]`).attr('checked', true);

    if ( !localStorage.getItem('review-version') || (localStorage.getItem('review-version') !== siteParams.site_version) ) {
        reviewed(rate);
        localStorage.setItem('review-version', siteParams.site_version);
        localStorage.setItem('review', rate.toString());
        $('#review-form').trigger("submit");
    }
}

function colorStar(toValue) {
    $('.star').each((index, el) => {
        if ( $(el).data('value') <= toValue ) {
            $(el).addClass('is-hover');
        }
    })
}

function reviewed(rate) {
    $('.star').off('mouseleave');
    colorStar(rate);
    changeBtnLable( $('#thank-you-box'), 'Thank you!' );
    $('.star').each((index, el) => { $(el).addClass('reviewed') })
}