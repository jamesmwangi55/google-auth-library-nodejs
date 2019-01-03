/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {create} from 'domain';

import {isWebpack} from '../webpack';

import {BrowserCrypto} from './browser/crypto';
import {NodeCrypto} from './node/crypto';

export interface JwkCertificate {
  kty: string;
  alg: string;
  use?: string;
  kid: string;
  n: string;
  e: string;
}

export interface CryptoSigner {
  update(data: string): void;
  sign(key: string, outputFormat: string): string;
}

// Crypto interface will provide required crypto functions.
// Use `createCrypto()` factory function to create an instance
// of Crypto. It will either use Node.js `crypto` module, or
// use browser's SubtleCrypto interface. Since most of the
// SubtleCrypto methods return promises, we must make those
// methods return promises here as well, even though in Node.js
// they are synchronous.
export interface Crypto {
  sha256DigestBase64(str: string): Promise<string>;
  randomBytesBase64(n: number): string;
  verify(pubkey: string|JwkCertificate, data: string|Buffer, signature: string):
      Promise<boolean>;
  createSign(algorithm: string): CryptoSigner;
}

export function createCrypto(): Crypto {
  if (isWebpack()) {
    return new BrowserCrypto();
  }
  return new NodeCrypto();
}
