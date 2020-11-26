[WIP](https://derekmiranda.github.io/tempest-html/)

# Dev Notes

- coordinates are relative to a unit square centerd at 0 since wanted to render in a scalable square canvas. So x and y range from [-0.5, 0.5]
- when defining shape geometry in `render` functions, use "local" canvas methods (like `localMoveTo` or `localLineTo`) to ensure canvas drawing that's relative to its entire object hierarchy
- when writing classes extending `BaseGameObject`, write `render` and `update` functions. These are called internally with the `BaseGameObject`'s `_render` and `_update` functions
- **z** - indicates depth from near (z = 0) to far (z = 1) plane

## Possible Polyfills to Fill

- Promises
- Map
- `Object.assign`
