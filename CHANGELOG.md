#### v2.0.0 (2023-04-26)

- Breaking Change: Package now uses native ES Modules.
- Breaking Change: Prebuilt browser-ready version has been removed.
- Bug Fix: TypeScript types improved to maintain the original function signature in the memoized function.

#### v1.1.0 (2020-03-07)

- New Feature: Add TypeScript type definition.

#### v1.0.5 (2018-01-25)

- Fix: Correctly skips incorrect cached value return on mismatched argument length

#### v1.0.4 (2017-09-06)

- Fix: Resolve infinite loop which can occur due to lingering references in recalling from previous cache
- Internal: Include more thorough test cases for expected cache list progression

#### v1.0.3 (2017-08-30)

- Fix: Resolve error which can occur in certain conditions with `maxSize`

#### v1.0.2 (2017-08-24)

- Fix: Resolve infinite loop which can occur due to lingering references in recalling from previous cache

#### v1.0.1 (2017-08-09)

- Internal: Include repository details in `package.json`

#### v1.0.0 (2017-08-08)

- Initial release
