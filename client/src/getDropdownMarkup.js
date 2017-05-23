import dedent from 'dedent-js';

const getDropdownMarkup = (title, body) => {

    const dropDownTemplate = dedent(
        `<MadCap:dropDown>
            <MadCap:dropDownHead>
                <MadCap:dropDownHotspot>${title}</MadCap:dropDownHotspot>
            </MadCap:dropDownHead>
            <MadCap:dropDownBody>
                ${body}
            </MadCap:dropDownBody>
        </MadCap:dropDown>`)

    return dropDownTemplate;
}

export default getDropdownMarkup;
