# utility-button

A generic utility button which can send a GET or POST to a URL of your choice.

Should be compatible Chromium based browsers, and Firefox once they enable Manifest 3 support.

The request can optionally contain
- The current tab's URL
- The current tabs contents

An optional auth header can be sent with a token of your choice.

---

Firefox is fussy about SVGs for extension icons and iirc Chrome straight up won't use them. Inkscape can be used to generate pngs though.

```bash
	inkscape -z -w 48 -h 48 input.svg -e output-48.png
```

---

Sadly web-ext does not support Manifest 3 yet so it's no use rn :/

Once it does this is how you persist a firefox profile for web-ext testing...

1. Create a new firefox profile: http://about:profiles
2. Create a .env file in your project root
3. Set the key FFPROFILE to be equal to the new profiles root directory
4. Profit
