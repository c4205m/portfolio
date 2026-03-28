import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
    eleventyConfig.addPlugin(HtmlBasePlugin);

    eleventyConfig.addPassthroughCopy("./src/style.css");
    eleventyConfig.addPassthroughCopy("./src/resume.css");
    eleventyConfig.addPassthroughCopy("./src/header.css");
    eleventyConfig.addPassthroughCopy("./src/footer.css");
    eleventyConfig.addPassthroughCopy("./src/gallery.css");
    eleventyConfig.addPassthroughCopy("./src/contact.css");

    eleventyConfig.addPassthroughCopy("./src/script.js");
    eleventyConfig.addPassthroughCopy("./src/contact.js");

    eleventyConfig.addPassthroughCopy("./src/media");
    
    return {
        dir: {
            input: "src",
            output: "_site",
        },
        pathPrefix: "/portfolio/",
    };
};