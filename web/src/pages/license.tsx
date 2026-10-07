import Wrapper from '../components/Wrapper';
import Image from 'next/image';

export default function LicensePage() {
  return (
    <Wrapper subtitle='License & Credits' license={false}>
      <div>
        <Image
          className='mb-8'
          src='/daggerheart-compatible-logo.webp'
          alt='Daggerheart Compatible banner'
          width={414}
          height={109}
        />
        <div className='flex items-center justify-between gap-4'>
          <Image
            src='/daggerheart-logo-small.png'
            alt='Daggerheart potion logo'
            width={50}
            height={58}
          />
          <div>
            <p className='text-dh-teal mb-4'>
              This product includes material from the Daggerheart System
              Reference Document 1.0, &copy; Critical Role, LLC, under the terms
              of the{' '}
              <a
                className='hover:text-dh-gold underline'
                target='_blank'
                href='https://darringtonpress.com/license'
              >
                Darrington Press Community Gaming License
              </a>
              .
            </p>
            <p className='text-dh-teal'>
              More information available at:
              <br />
              <a
                className='hover:text-dh-gold underline'
                target='_blank'
                href='https://www.daggerheart.com'
              >
                https://www.daggerheart.com
              </a>
            </p>
          </div>
        </div>
        <div className='border-dh-teal mbs-10 mbe-2 w-full border-t-2' />
        <p className='mb-4'>
          The portions of the software not covered by the Darrington Press
          Community Gaming License are licensed under the{' '}
          <strong>MIT License</strong>.
        </p>
        <p className='mb-4'>Copyright &copy; 2026 Bradley Staples</p>
        <p className='mb-4'>
          Permission is hereby granted, free of charge, to any person obtaining
          a copy of this software and associated documentation files (the
          &quot;Software&quot;), to deal in the Software without restriction,
          including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software,
          and to permit persons to whom the Software is furnished to do so,
          subject to the following conditions:
        </p>
        <p className='mb-4'>
          The above copyright notice and this permission notice shall be
          included in all copies or substantial portions of the Software.
        </p>
        <p className='mb-4'>
          THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY
          KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
          OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
          NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
          LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
          OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
          WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </p>
      </div>
    </Wrapper>
  );
}
