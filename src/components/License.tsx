import Image from 'next/image';

export default function License() {
  return (
    <div>
      <h1>License & Credits</h1>
      <p>
        <Image
          src='/daggerheart-logo-small.png'
          alt='Daggerheart'
          width={25}
          height={29}
        />
        <span>
          This product includes material from the Daggerheart System Reference
          Document 1.0, &copy; Critical Role, LLC, under the terms of the
          Darrington Press Community Gaming License.
        </span>
      </p>
      <hr />
      <p>
        <span>
          More at{' '}
          <a href='https://www.daggerheart.com'>https://www.daggerheart.com</a>
        </span>
      </p>
      <Image
        src='/daggerheart-compatible-logo.webp'
        alt='Daggerheart Compatible'
        width={414}
        height={109}
      />
    </div>
  );
}
