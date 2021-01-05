using System;
using System.IO;
using System.Linq;
using System.Text;

namespace SkbKontur.DbViewer.TestApi.Controllers
{
    public class DownloadFileStream : Stream
    {
        public override void Flush()
        {
            throw new NotImplementedException();
        }

        public override int Read(byte[] buffer, int offset, int count)
        {
            if (bufferIdx >= readBuffer.Length)
            {
                var data = GetData();
                readBuffer = Encoding.UTF8.GetBytes(string.Join("\n", data) + (data.Length == 0 ? "" : "\n"));
                bufferIdx = 0;
            }

            var length = Math.Min(count, readBuffer.Length - bufferIdx);
            var sourceIndex = bufferIdx;
            bufferIdx += length;
            Array.Copy(readBuffer, sourceIndex, buffer, offset, length);
            return length;
        }

        public override long Seek(long offset, SeekOrigin origin)
        {
            throw new NotImplementedException();
        }

        public override void SetLength(long value)
        {
            throw new NotImplementedException();
        }

        public override void Write(byte[] buffer, int offset, int count)
        {
            throw new NotImplementedException();
        }

        private string[] GetData()
        {
            if (i >= 10_000_000)
                return new string[0];

            var idx = i;
            i += 100;
            return Enumerable.Range(idx, 100).Select(x =>
                {
                    byte[] bytes = new byte[200];
                    random.NextBytes(bytes);
                    return $"{x},{random.Next()},{Convert.ToBase64String(bytes)}";
                }).ToArray();
        }

        public override bool CanRead => true;
        public override bool CanSeek => false;
        public override bool CanWrite => false;
        public override long Length => throw new NotImplementedException();
        public override long Position { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

        private int i = 0;

        private byte[] readBuffer = new byte[0];
        private int bufferIdx = 0;

        private readonly Random random = new Random();
    }
}