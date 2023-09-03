import { readFileSync, writeFileSync } from "fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const versions = JSON.parse(readFileSync("versions.json", "utf8"));

const { author, description, name, version } = pkg;
const { minAppVersion } = manifest;

const updatedManifest = { ...manifest, author, description, id: name, version };
writeFileSync("manifest.json", JSON.stringify(updatedManifest, null, "  "));

const updatedVersions = { ...versions, [version]: minAppVersion };
writeFileSync("versions.json", JSON.stringify(updatedVersions, null, "  "));
